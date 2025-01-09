import type {NextApiRequest, NextApiResponse} from 'next';
import {HttpMethod} from '@/types/api';
import {hasApiPrivileges} from '@/services/api-service';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/pages/api/auth/[...nextauth]';
import {Pages} from '@/configs/pages';

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(200).json({ user: session.user });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allowedMethods = [HttpMethod.GET, HttpMethod.PATCH];
  const hasPrivileges = await hasApiPrivileges(req, res, {
    allowedMethods, permissions: Pages.profile.permissions
  });
  if (!hasPrivileges) {
    return;
  }

  if (req.method === HttpMethod.GET) {
    return await getHandler(req, res);
  }
}