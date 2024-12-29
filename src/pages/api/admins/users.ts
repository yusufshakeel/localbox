import { NextApiRequest, NextApiResponse } from 'next';
import {verifyAuthorizationBearerToken} from '@/services/jwt-service';
import {db} from '@/configs/database/auth';
import {db as dbPagePermissions} from '@/configs/database/page-permissions';
import {getISOStringDate} from '@/utils/date';
import {AUTH_FILENAME} from '@/configs/auth';
import {AccountStatus} from '@/types/account-status';
import {AccountType} from '@/types/account-type';
import passwordService from '@/services/password-service';
import {PAGE_PERMISSIONS_FILENAME} from '@/configs/pages';

const postHandler = (req: any, res: any) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const usernameAlreadyExists = db.query.select(AUTH_FILENAME, { where: { username } });
  if (usernameAlreadyExists.length > 0) {
    return res.status(400).json({ message: 'Username is taken' });
  }

  const userId = db.query.insert(AUTH_FILENAME, {
    username,
    accountType: 'user',
    accountStatus: 'active',
    password: passwordService.hashPassword(password.trim()),
    rbac: {
      role: 'user',
      permissions: []
    },
    createdAt: getISOStringDate()
  });

  return res.status(201).json({ message: 'User created successfully.', userId });
};

const patchHandler = (req: any, res: any) => {
  const { userId, username, password, permissions = [], accountStatus } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const dataToUpdate: any = {};
  if (username) {
    dataToUpdate['username'] = username.trim();
  }
  if (password) {
    dataToUpdate['password'] = passwordService.hashPassword(password.trim());
  }
  if (accountStatus
    && [AccountStatus.active, AccountStatus.inactive, AccountStatus.suspended]
      .includes(accountStatus)) {
    dataToUpdate['accountStatus'] = accountStatus;
  }

  if (Array.isArray(permissions) && permissions?.length) {
    const pagePermissions = dbPagePermissions.query.select(
      PAGE_PERMISSIONS_FILENAME,
      { attributes: ['permissions'] }
    ).reduce((acc, permission) => [...acc, ...permission], []);

    const hasMismatchPermissions = permissions.some(permission => {
      return !pagePermissions.includes(permission);
    });

    if (hasMismatchPermissions) {
      return res.status(400).json({ message: 'Has invalid permission values' });
    }

    dataToUpdate['permissions'] = permissions;
  }

  if (!Object.keys(dataToUpdate).length) {
    return res.status(400).json({ message: 'Nothing to update' });
  }

  const where = { where: { id: userId, accountType: AccountType.user } };

  const usernameAlreadyExists = db.query.select(
    AUTH_FILENAME,
    where
  );

  if (usernameAlreadyExists.length !== 1) {
    return res.status(400).json({ message: 'User not found' });
  }

  db.query.update(
    AUTH_FILENAME,
    { ...dataToUpdate, updatedAt: getISOStringDate() },
    where
  );

  return res.status(200).json({ message: 'User account updated successfully.', userId });
};

const getHandler = (req: any, res: any) => {
  const where: any = {
    accountType: 'user'
  };
  if (req.query.id) {
    where['id'] = req.query.id;
  }
  if (req.query.username) {
    where['username'] = req.query.username;
  }
  if (req.query.accountStatus) {
    where['accountStatus'] = req.query.accountStatus;
  }
  const users = db.query.select(
    AUTH_FILENAME,
    {
      where,
      attributes: ['id', 'username', 'accountType', 'accountStatus', 'rbac', 'createdAt', 'updatedAt']
    }
  );
  return res.status(200).json({ users });
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

    if (req.method === 'PATCH') {
      return patchHandler(req, res);
    }

    if (req.method === 'GET') {
      return getHandler(req, res);
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message, message: 'Something went wrong' });
  }
}