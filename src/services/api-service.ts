import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/pages/api/auth/[...nextauth]';
import {UserType} from '@/types/users';
import {PermissionsType} from '@/types/permissions';

export function isAllowedMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
) {
  if (!allowedMethods.includes(req.method as string)) {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  return true;
}

export async function isValidSessionWithPermissions(
  req: NextApiRequest,
  res: NextApiResponse,
  option?: { type: string, permissions: string[] }
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {user: {type, permissions}} = session;

  if (option && (option.type !== type || !option.permissions.some(v => permissions.includes(v)))) {
    return res.status(403).json({ message: 'Forbidden: Do not have required permissions.' });
  }

  return true;
}

export async function hasAdminApiPrivileges(
  req: NextApiRequest,
  res: NextApiResponse,
  option: { allowedMethods: string[] } = { allowedMethods: [] }
) {
  if (!isAllowedMethod(req, res, option.allowedMethods)) {
    return;
  }

  const isAuthorized = await isValidSessionWithPermissions(
    req,
    res,
    { type: UserType.admin, permissions: [PermissionsType.ADMIN] }
  );
  if (!isAuthorized) {
    return;
  }

  return true;
}