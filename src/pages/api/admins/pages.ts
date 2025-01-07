import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasAdminApiPrivileges} from '@/services/api-service';
import {db, PagesCollectionName} from '@/configs/database/pages';

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const attributes = ['id', 'link', 'title', 'type', 'status', 'permissions', 'createdAt', 'updatedAt'];
    const pages = await db.query.selectAsync(PagesCollectionName, {
      attributes,
      orderBy: [
        { attribute: 'title' }
      ]
    });
    return res.status(200).json({pages});
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allowedMethods = [HttpMethod.GET];
  if (!await hasAdminApiPrivileges(req, res, { allowedMethods })) {
    return;
  }

  if (req.method === HttpMethod.GET) {
    return await getHandler(req, res);
  }
}