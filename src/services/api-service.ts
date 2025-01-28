import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/pages/api/auth/[...nextauth]';
import {UserStatus, UserType} from '@/types/users';
import {PermissionsType} from '@/types/permissions';
import {db, UsersCollectionName} from '@/configs/database/users';

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
  option: {
    allowedUserTypes: string[],
    allowedPermissions: string[]
  } = { allowedUserTypes:[], allowedPermissions:[] }
) {
  const session = await getServerSession(req, res, authOptions);
  const { allowedUserTypes, allowedPermissions } = option;

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = (await db.query.selectAsync(
    UsersCollectionName,
    {
      where: { id: session.user.id, status: UserStatus.active },
      attributes: [
        'id', 'username', 'displayName', 'status', 'type', 'permissions',
        'personalDriveStorageLimit', 'personalDriveStorageUsed',
        'createdAt', 'updatedAt'
      ]
    }
  ))?.[0];
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const listOfPermissions = [...allowedPermissions, PermissionsType.ADMIN];

  if (!allowedUserTypes.includes(user.type)
    || !listOfPermissions.some(v => user.permissions.includes(v))
  ) {
    return res.status(403).json({ message: 'Forbidden: Do not have required permissions.' });
  }

  return { ...session, user: { ...session.user, ...user } };
}

export async function hasApiPrivileges(
  req: NextApiRequest,
  res: NextApiResponse,
  option: {
    allowedUserTypes?: string[],
    allowedMethods: string[],
    permissions: string[]
  } = { allowedMethods: [], permissions: [] }
) {
  if (!isAllowedMethod(req, res, option.allowedMethods)) {
    return;
  }

  const session = await isValidSessionWithPermissions(
    req,
    res,
    {
      allowedUserTypes: option.allowedUserTypes || [UserType.user, UserType.admin],
      allowedPermissions: option.permissions
    }
  );
  if (!session) {
    return;
  }

  return session;
}

export async function hasAdminApiPrivileges(
  req: NextApiRequest,
  res: NextApiResponse,
  option: { allowedMethods: string[] } = { allowedMethods: [] }
) {
  if (!isAllowedMethod(req, res, option.allowedMethods)) {
    return;
  }

  const session = await isValidSessionWithPermissions(
    req,
    res,
    { allowedUserTypes: [UserType.admin], allowedPermissions: [PermissionsType.ADMIN] }
  );
  if (!session) {
    return;
  }

  return session;
}