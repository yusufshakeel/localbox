import type { NextApiRequest, NextApiResponse } from 'next';
import {hasAdminApiPrivileges} from '@/services/api-service';
import {HttpMethod} from '@/types/api';
import {UserStatus, UserType} from '@/types/users';
import {db, UsersCollectionName} from '@/configs/database/users';
import {
  userCreateSchema,
  userUpdatePasswordSchema,
  userUpdatePermissionsSchema,
  userUpdateSchema
} from '@/validations/user-validation';
import {getISOStringDate} from '@/utils/date';
import passwordService from '@/services/password-service';
import {Pages} from '@/configs/pages';

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const where = {type: UserType.user};
  const attributes = [
    'id',
    'username',
    'displayName',
    'type',
    'status',
    'permissions',
    'personalDriveStorageLimit',
    'createdAt',
    'updatedAt'
  ];
  const users = await db.query.selectAsync(UsersCollectionName, {where, attributes});
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
    password: passwordService.hashPassword(parsedData.data.password),
    permissions: [],
    type: UserType.user,
    status: UserStatus.active,
    createdAt: getISOStringDate()
  };

  const userExists = await db.query.selectAsync(
    UsersCollectionName,
    { where: { username: parsedData.data.username } }
  );
  if (userExists.length) {
    return res.status(400).json({message: 'Username already exists'});
  }

  const id = await db.query.insertAsync(UsersCollectionName, dataToInsert);
  return res.status(201).json({id});
}

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.userId) {
    return res.status(401).json({ error: 'User Id is missing' });
  }
  const where = { id: req.query.userId };

  const userExists = await db.query.selectAsync(UsersCollectionName, { where });
  if (userExists.length !== 1) {
    return res.status(400).json({message: 'User not found'});
  }
  const user = userExists[0];

  let parsedData;
  if (req.query.updateFor === 'accountDetails') {
    parsedData = await userUpdateSchema.safeParseAsync(req.body);
  }
  else if (req.query.updateFor === 'password') {
    parsedData = await userUpdatePasswordSchema.safeParseAsync(req.body);
  }
  else if (req.query.updateFor === 'permissions') {
    parsedData = await userUpdatePermissionsSchema.safeParseAsync(req.body);
  }
  if (!parsedData?.success) {
    return res.status(401).json({ error: parsedData});
  }

  const dataToUpdate = {
    ...user,
    ...parsedData.data,
    updatedAt: getISOStringDate()
  };
  if ((parsedData.data as any).personalDriveStorageLimit) {
    dataToUpdate['personalDriveStorageLimit'] = Number((parsedData.data as any).personalDriveStorageLimit);
  }
  if ((parsedData.data as any).password) {
    dataToUpdate['password'] = passwordService.hashPassword((parsedData.data as any).password);
  }

  if ((parsedData.data as any).permissions) {
    const permissionsToUpdate = (parsedData.data as any).permissions;
    const listOfPermissionsForUser = Object.values(Pages)
      .filter(v => [UserType.any, UserType.user].some(p => v.pageFor.includes(p)))
      .map(v => v.permissions)
      .flat(2);
    if (permissionsToUpdate.some((p: string) => !listOfPermissionsForUser.includes(p))) {
      return res.status(400).json({message: 'Unknown permission'});
    }
  }

  const updatedRows = await db.query.updateAsync(UsersCollectionName, dataToUpdate, {where});
  if (updatedRows) {
    return res.status(200).json({id: req.query.userId});
  }
  return res.status(401).json({ error: 'Failed to update user' });
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.userId) {
    return res.status(401).json({error: 'User Id is missing'});
  }
  const where = {type: UserType.user, id: req.query.userId};
  const deletedCount = await db.query.deleteAsync(UsersCollectionName, {where});
  if (deletedCount) {
    return res.status(200).json({id: req.query.userId});
  }
  return res.status(401).json({error: 'Failed to delete user'});
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allowedMethods = [
      HttpMethod.GET, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH
    ];
    const session = await hasAdminApiPrivileges(req, res, { allowedMethods });
    if (!session) {
      return;
    }

    if (req.method === HttpMethod.GET) {
      return await getHandler(req, res);
    }

    if (req.method === HttpMethod.POST) {
      return await postHandler(req, res);
    }

    if (req.method === HttpMethod.PATCH) {
      return await patchHandler(req, res);
    }

    if (req.method === HttpMethod.DELETE) {
      return await deleteHandler(req, res);
    }
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
}