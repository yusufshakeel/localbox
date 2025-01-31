import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';
import {db, UsersCollectionName} from '@/configs/database/users';
import {userUpdatePasswordSchema, userUpdateProfileDetailsSchema} from '@/validations/user-validation';
import {getISOStringDate} from '@/utils/date';
import {UserStatus} from '@/types/users';
import passwordService from '@/services/password-service';

async function getHandler(req: NextApiRequest, res: NextApiResponse, session: any) {
  if (!req.query.userId) {
    return res.status(401).json({ error: 'User Id is missing' });
  }
  const where = { id: req.query.userId, status: UserStatus.active };

  const attributes = session.user.id === req.query.userId
    ? ['id', 'username', 'displayName', 'type', 'status', 'permissions', 'createdAt', 'updatedAt']
    : ['id', 'username', 'displayName', 'type', 'createdAt'];

  const userExists = await db.query.selectAsync(UsersCollectionName, {
    where,
    attributes
  });
  if (userExists.length !== 1) {
    return res.status(400).json({message: 'User not found'});
  }
  const user = userExists[0];

  return res.status(200).json({ user });
}

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.userId) {
    return res.status(401).json({ error: 'User Id is missing' });
  }
  const where = { id: req.query.userId, status: UserStatus.active };

  const userExists = await db.query.selectAsync(UsersCollectionName, { where });
  if (userExists.length !== 1) {
    return res.status(400).json({message: 'User not found'});
  }
  const user = userExists[0];

  let parsedData;
  if (req.query.updateFor === 'accountDetails') {
    parsedData = await userUpdateProfileDetailsSchema.safeParseAsync(req.body);
  } else if (req.query.updateFor === 'password') {
    parsedData = await userUpdatePasswordSchema.safeParseAsync(req.body);
  }
  if (!parsedData?.success) {
    return res.status(401).json({ error: parsedData});
  }

  const dataToUpdate = {
    ...user,
    ...parsedData.data,
    updatedAt: getISOStringDate()
  };
  if ((parsedData.data as any).password) {
    dataToUpdate['password'] = passwordService.hashPassword((parsedData.data as any).password);
  }

  const updatedRows = await db.query.updateAsync(UsersCollectionName, dataToUpdate, {where});
  if (updatedRows) {
    return res.status(200).json({id: req.query.userId});
  }
  return res.status(401).json({ error: 'Failed to update user' });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allowedMethods = [HttpMethod.GET, HttpMethod.PATCH];
    const session = await hasApiPrivileges(req, res, {
      allowedMethods, permissions: Pages.profile.permissions
    });
    if (!session) {
      return;
    }

    if (req.method === HttpMethod.GET) {
      return await getHandler(req, res, session);
    }

    if (req.method === HttpMethod.PATCH) {
      return await patchHandler(req, res);
    }

    return res.status(400).json({ error: 'No handler' });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}