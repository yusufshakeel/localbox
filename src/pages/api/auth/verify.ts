import { NextApiRequest, NextApiResponse } from 'next';
import {verifyToken} from '@/services/jwt-service';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ isValid?: boolean, message?: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  if (!req.body.accessToken) {
    return res.status(400).json({ message: 'Access token is missing' });
  }
  return res.status(200).json({ isValid: !!verifyToken(req.body.accessToken) });
}