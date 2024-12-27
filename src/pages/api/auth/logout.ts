import { NextApiRequest, NextApiResponse } from 'next';
import {verifyToken} from '@/services/jwt-service';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  if (!req.body.accessToken) {
    return res.status(400).json({ message: 'Access token is missing' });
  }
  if (!verifyToken(req.body.accessToken)) {
    return res.status(400).json({ message: 'Invalid access token' });
  }
  return res.status(200).json({ message: 'Logged out' });
}