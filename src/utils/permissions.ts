import {PermissionsType} from '@/types/permissions';
import {UserType} from '@/types/users';

export const hasPermissions = (
  data: Partial<{ user: { permissions: string[]} }>,
  permissions: string[]
) => {
  return data && [...permissions, PermissionsType.ADMIN].some(permission =>
    data.user?.permissions.includes(permission));
};

export const isLoggedInSessionForAdmin = (session: any) => {
  return session?.user?.type === UserType.admin;
};

export const isLoggedInSessionForUser = (session: any) => {
  return session?.user?.type === UserType.user;
};