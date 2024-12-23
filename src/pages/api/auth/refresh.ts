import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'js-cookie';
import {generateAccessToken, verifyToken} from '@/services/jwt-service';
import {AuthPayload} from '@/types/auth-payload';
import {AuthBaseResponse} from '@/types/api-responses';

export default function handler(req: NextApiRequest, res: NextApiResponse<AuthBaseResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const refreshToken = Cookies.get('refresh_token');

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  const payload = verifyToken(refreshToken);

  if (payload) {
    const { username, accountType } = payload as AuthPayload;
    const accessToken = generateAccessToken({ username, accountType });
    return res.status(200).json({ accessToken });
  }

  return res.status(401).json({ message: 'Invalid refresh token' });
}