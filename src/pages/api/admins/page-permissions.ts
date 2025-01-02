import { NextApiRequest, NextApiResponse } from 'next';
import {verifyAuthorizationBearerToken} from '@/services/jwt-service';
import {db} from '@/configs/database/page-permissions';
import {getISOStringDate} from '@/utils/date';
import {PAGE_PERMISSIONS_FILENAME} from '@/configs/pages';
import {PageType} from '@/types/page-permission';

const postHandler = (req: any, res: any) => {
  const { pageUrl, permissions } = req.body;
  if (!pageUrl) {
    return res.status(400).json({ message: 'pageUrl is required' });
  }
  if (!permissions) {
    return res.status(400).json({ message: 'permissions is required' });
  }

  const pageAlreadyExists = db.query.select(PAGE_PERMISSIONS_FILENAME, { where: { pageUrl } });
  if (pageAlreadyExists.length > 0) {
    return res.status(400).json({ message: 'PageUrl is taken' });
  }

  const pageId = db.query.insert(PAGE_PERMISSIONS_FILENAME, {
    pageUrl,
    pageType: PageType.custom,
    permissions,
    createdAt: getISOStringDate()
  });

  return res.status(201).json({ message: 'Page permissions created successfully.', pageId });
};

const getHandler = (req: any, res: any) => {
  const where: any = {};
  if (req.query.pageId) {
    where['pageId'] = req.query.pageId;
  }
  const pagePermissions = db.query.select(PAGE_PERMISSIONS_FILENAME, { where });
  return res.status(200).json({ pagePermissions });
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE', 'GET'].includes(req.method!)) {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const verifyAuthToken = verifyAuthorizationBearerToken(req);
    if (verifyAuthToken.statusCode !== 200) {
      return res.status(verifyAuthToken.statusCode).json({ message: verifyAuthToken.message });
    }

    if (verifyAuthToken.payload.rbac.role !== 'admin') {
      return res.status(400).json({ message: 'Invalid access token' });
    }

    if (req.method === 'POST') {
      return postHandler(req, res);
    }

    if (req.method === 'GET') {
      return getHandler(req, res);
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message, message: 'Something went wrong' });
  }
}