import type { NextApiRequest, NextApiResponse } from 'next';
import {hasAdminApiPrivileges} from '@/services/api-service';
import {HttpMethod} from '@/types/api';
import {UserType} from '@/types/users';
import {db, UsersCollectionName} from '@/configs/database/users';

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const where = { type: UserType.user };
  const attributes = ['id', 'username', 'displayName', 'type', 'permissions', 'createdAt', 'updatedAt'];
  const users = await db.query.selectAsync(UsersCollectionName, { where, attributes });
  return res.status(200).json({users});
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!await hasAdminApiPrivileges(req, res, { allowedMethods: [HttpMethod.GET] })) {
    return;
  }

  if (req.method === 'GET') {
    return await getHandler(req, res);
  }
}