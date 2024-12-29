import { NextApiRequest, NextApiResponse } from 'next';
import {verifyAuthorizationBearerToken} from '@/services/jwt-service';
import {db} from '@/configs/database/auth';
import bcrypt from 'bcrypt';
import {getISOStringDate} from '@/utils/date';
import {AUTH_FILENAME} from '@/configs/auth';

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
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    rbac: {
      role: 'user',
      permissions: []
    },
    createdAt: getISOStringDate()
  });

  return res.status(201).json({ message: 'User created successfully.', userId });
};

const getHandler = (req: any, res: any) => {
  const where: any = {
    accountType: 'user'
  };
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

    if (req.method === 'GET') {
      return getHandler(req, res);
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message, message: 'Something went wrong' });
  }
}