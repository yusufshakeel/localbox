import passwordService from '@/services/password-service';
import {UserStatus, UserType} from '@/types/users';
import {db as Users, UsersCollectionName} from '@/configs/database/users';
import {getISOStringDate} from '@/utils/date';
import {PermissionsType} from '@/types/permissions';
import path from 'path';
import {RESET_ADMIN_PASSWORD_FILE} from '@/configs';
import fs from 'fs';
import {AUTH_PASSWORD_MAX_LENGTH} from '@/configs/auth';

export async function resetAdminPasswordIfRequired() {
  const filePath = path.join(process.cwd(), 'private', RESET_ADMIN_PASSWORD_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'NEW_PASSWORD=', 'utf8');
    return;
  }

  const password = fs.readFileSync(filePath, 'utf8').split('=')[1].trim();
  if (!password.length) {
    return;
  }

  if (password.length > AUTH_PASSWORD_MAX_LENGTH || password.length < 8) {
    // eslint-disable-next-line
    console.log(
      `[resetAdminPassword][resetAdminPasswordIfRequired] Password must be between 8 and ${AUTH_PASSWORD_MAX_LENGTH} characters`
    );
    return;
  }

  // eslint-disable-next-line
  console.log('[resetAdminPassword][resetAdminPasswordIfRequired] About to update the admin password');

  const where = { where: { username: 'admin' } };
  const existingAdmins = await Users.query.selectAsync(UsersCollectionName, where);
  if (existingAdmins.length) {
    await Users.query.updateAsync(
      UsersCollectionName,
      {
        password: passwordService.hashPassword(password),
        updatedAt: getISOStringDate()
      },
      where
    );
  }

  fs.accessSync(filePath);
  fs.unlinkSync(filePath);

  // eslint-disable-next-line
  console.log('[resetAdminPassword][resetAdminPasswordIfRequired] Admin password updated successfully.');
}

export function setupAdminAccount() {
  let isAccountCreated = false;
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
        status: UserStatus.active,
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
    isAccountCreated = true;
  }

  return {
    isAccountCreated,
    username: adminUser.username,
    password: plainTextPassword
  };
}