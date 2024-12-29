import { NextApiRequest, NextApiResponse } from 'next';
import {verifyAuthorizationBearerToken} from '@/services/jwt-service';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const verifyAuthToken = verifyAuthorizationBearerToken(req);
  if (verifyAuthToken.statusCode !== 200) {
    return res.status(verifyAuthToken.statusCode).json({ message: verifyAuthToken.message });
  }

  const {payload} = verifyAuthToken;
  return res.status(200).json({
    id: payload.id,
    username: payload.username,
    accountType: payload.accountType,
    rbac: payload.rbac
  });
}