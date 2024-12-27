import { NextApiRequest, NextApiResponse } from 'next';
import {generateAccessToken, generateRefreshToken} from '@/services/jwt-service';
import passwordService from '@/services/password-service';
import {AuthBaseResponse} from '@/types/api-responses';
import {AuthPayload} from '@/types/auth-payload';
import {db} from '@/configs/database/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthBaseResponse>
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
    const payload: AuthPayload = {
      username,
      accountType
    };

    // Generate tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(200).json({ accessToken, refreshToken });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}
