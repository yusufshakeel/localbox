import type { NextApiRequest, NextApiResponse } from 'next';
import {hasAdminApiPrivileges} from '@/services/api-service';
import {HttpMethod} from '@/types/api';
import {UserStatus, UserType} from '@/types/users';
import {db, UsersCollectionName} from '@/configs/database/users';
import {userCreateSchema} from '@/validations/user-validation';
import {getISOStringDate} from '@/utils/date';

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const where = { type: UserType.user };
  const attributes = ['id', 'username', 'displayName', 'type', 'permissions', 'createdAt', 'updatedAt'];
  const users = await db.query.selectAsync(UsersCollectionName, { where, attributes });
  return res.status(200).json({users});
}

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsedData = await userCreateSchema.safeParseAsync(req.body);
  if (!parsedData.success) {
    return res.status(401).json({ error: parsedData});
  }
  const dataToInsert = {
    ...parsedData.data,
    permissions: [],
    type: UserType.user,
    status: UserStatus.active,
    createdAt: getISOStringDate()
  };
  const id = await db.query.insertAsync(UsersCollectionName, dataToInsert);
  return res.status(201).json({id});
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.userId) {
    return res.status(401).json({ error: 'User Id is missing' });
  }
  const where = { type: UserType.user, id: req.query.userId };
  const deletedCount = await db.query.deleteAsync(UsersCollectionName, { where });
  if (deletedCount) {
    return res.status(200).json({id: req.query.userId});
  }
  return res.status(401).json({ error: 'Failed to delete user' });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allowedMethods = [HttpMethod.GET, HttpMethod.POST, HttpMethod.DELETE];
  if (!await hasAdminApiPrivileges(req, res, { allowedMethods })) {
    return;
  }

  if (req.method === HttpMethod.GET) {
    return await getHandler(req, res);
  }

  if (req.method === HttpMethod.POST) {
    return await postHandler(req, res);
  }

  if (req.method === HttpMethod.DELETE) {
    return await deleteHandler(req, res);
  }
}