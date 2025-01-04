import passwordService from '@/services/password-service';
import {UserStatus, UserType} from '@/types/users';
import {db as Users, UsersCollectionName} from '@/configs/database/users';
import {getISOStringDate} from '@/utils/date';

export function setupAdminAccount() {
  const plainTextPassword = 'root1234';
  const adminUser = {
    username: 'admin',
    displayName: 'Admin',
    password: passwordService.hashPassword(plainTextPassword),
    status: UserStatus.active,
    type: UserType.admin
  };
  const where = { where: { username: adminUser.username } };
  if (Users.query.select(UsersCollectionName, where).length) {
    Users.query.update(
      UsersCollectionName,
      {
        ...adminUser,
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