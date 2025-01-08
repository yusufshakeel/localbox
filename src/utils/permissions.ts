import {PermissionsType} from '@/types/permissions';

export const hasPermissions = (userPermissions: string[], permissions: string[]) => {
  return [...permissions, PermissionsType.ADMIN].some(permission =>
    userPermissions.includes(permission));
};