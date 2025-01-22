import passwordService from '@/services/password-service';
import {UserStatus, UserType} from '@/types/users';
import {db as Users, UsersCollectionName} from '@/configs/database/users';
import {getISOStringDate} from '@/utils/date';
import {PermissionsType} from '@/types/permissions';

export function setupAdminAccount() {
  const plainTextPassword = 'root1234';
  const adminUser = {
    username: 'admin',
    displayName: 'Admin',
    password: passwordService.hashPassword(plainTextPassword),
    status: UserStatus.active,
    type: UserType.admin,
    permissions: [PermissionsType.ADMIN]
  };
  const where = { where: { username: adminUser.username } };
  const existingAdmins = Users.query.select(UsersCollectionName, where);
  if (existingAdmins.length) {
    Users.query.update(
      UsersCollectionName,
      {
        ...existingAdmins[0],
        permissions: adminUser.permissions,
        updatedAt: getISOStringDate()
      },
      where
    );
  } else {
    Users.query.insert(
      UsersCollectionName,
      {
        ...adminUser,
        createdAt: getISOStringDate()
      }
    );
  }

  return {
    username: adminUser.username,
    password: plainTextPassword
  };
}