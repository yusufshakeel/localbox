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
  if (!req.headers.authorization) {
    return res.status(200).json({ isValid: false, message: 'Access token is missing' });
  }
  return res.status(200).json({ isValid: !!verifyToken(req.headers.authorization.split('Bearer ')[1]) });
}