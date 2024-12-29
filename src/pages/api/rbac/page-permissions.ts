import { NextApiRequest, NextApiResponse } from 'next';
import {verifyAuthorizationBearerToken} from '@/services/jwt-service';
import {AccountType} from '@/types/account-type';
import {db} from '@/configs/database/page-permissions';
import {PAGE_PERMISSIONS_FILENAME} from '@/configs/pages';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pageId = req.query.pageId;
  if (!pageId) {
    return res.status(400).json({ message: 'pageId is required' });
  }

  const verifyAuthToken = verifyAuthorizationBearerToken(req);
  if (verifyAuthToken.statusCode !== 200) {
    return res.status(verifyAuthToken.statusCode).json({ message: verifyAuthToken.message });
  }

  const {payload} = verifyAuthToken;

  if (payload.accountType === AccountType.admin) {
    return res.status(200).json({ hasPermissions: true });
  }

  if (payload.accountType === AccountType.user) {
    const pagePermissions: string[] =
      db.query.select(PAGE_PERMISSIONS_FILENAME, { where: { pageId } })[0];

    const hasPermissions =
      payload.rbac.permissions.some((v: string) => pagePermissions.includes(v));

    return res.status(200).json({ hasPermissions });
  }

  return res.status(400).json({ message: 'Unknown account type'});
}