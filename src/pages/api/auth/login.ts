import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';
import path from 'path';
import {generateAccessToken, generateRefreshToken} from '@/services/jwt-service';
import {AUTH_FILE_PATH} from '@/configs/auth';
import passwordService from '@/services/password-service';
import {AuthBaseResponse} from '@/types/api-responses';
import {AuthPayload} from '@/types/auth-payload';

const authFile = path.join(process.cwd(), AUTH_FILE_PATH);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthBaseResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let accounts: any = {};
  try {
    accounts = fs.readJSONSync(authFile);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: any) {
    // do nothing
  }

  const { username, password, accountType } = req.body;

  if (accounts[accountType]?.[username]
    && passwordService.isValidPassword(password, accounts[accountType][username]['password'])
  ) {
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
