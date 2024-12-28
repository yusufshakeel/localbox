import { NextApiRequest, NextApiResponse } from 'next';
import {generateAccessToken, generateRefreshToken} from '@/services/jwt-service';
import passwordService from '@/services/password-service';
import {AuthBaseResponse, AuthLoginApiResponse} from '@/types/api-responses';
import {AuthPayload} from '@/types/auth-payload';
import {db} from '@/configs/database/auth';
import {AccountRBAC} from '@/types/account-rbac';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthLoginApiResponse | AuthBaseResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password, accountType } = req.body;
  const account = db.query.select(
    'auth',
    {
      where: {
        username,
        accountType,
        accountStatus: 'active'
      }
    }
  );

  if (account.length === 1 && passwordService.isValidPassword(password, account[0]['password'])) {
    const id = account[0]['id'] as string;
    const rbac = account[0]['rbac'] as AccountRBAC;
    const payload: AuthPayload = {
      id,
      username,
      accountType,
      rbac
    };

    // Generate tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(200).json({ accessToken, refreshToken, id, username, accountType });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}
