import { resetAdminPasswordIfRequired, setupAdminAccount } from '@/setup/admin-account';
import { db as Users, UsersCollectionName } from './../../../src/configs/database/users';
import PasswordService from '@/services/password-service';
import fs from 'fs';
import path from 'path';
import { RESET_ADMIN_PASSWORD_FILE } from '@/configs';
import {UserStatus, UserType} from '@/types/users';
import {PermissionsType} from '@/types/permissions';

jest.mock('./../../../src/configs/database/users', () => ({
  db: {
    query: {
      selectAsync: jest.fn(),
      updateAsync: jest.fn(),
      select: jest.fn(),
      update: jest.fn(),
      insert: jest.fn()
    }
  },
  UsersCollectionName: 'users'
}));

describe('Admin account account', () => {
  const existsSync = jest.fn();
  const readFileSync = jest.fn();
  const writeFileSync = jest.fn();
  const accessSync = jest.fn();
  const unlinkSync = jest.fn();
  const hashPassword = jest.fn();

  beforeEach(() => {
    jest.spyOn(fs, 'existsSync').mockImplementation(existsSync);
    jest.spyOn(fs, 'readFileSync').mockImplementation(readFileSync);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(writeFileSync);
    jest.spyOn(fs, 'accessSync').mockImplementation(accessSync);
    jest.spyOn(fs, 'unlinkSync').mockImplementation(unlinkSync);
    jest.spyOn(PasswordService, 'hashPassword').mockImplementation(hashPassword);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('resetAdminPasswordIfRequired', () => {
    const resetAdminPasswordFilePath = path.join(process.cwd(), 'private', RESET_ADMIN_PASSWORD_FILE);

    it('should create password file if it does not exist', async () => {
      existsSync.mockReturnValue(false);
      await resetAdminPasswordIfRequired();
      expect(writeFileSync).toHaveBeenCalledWith(
        resetAdminPasswordFilePath,
        'NEW_PASSWORD=',
        'utf8'
      );
    });

    it('should do nothing if password file exists but has no new password', async () => {
      existsSync.mockReturnValue(true);
      readFileSync.mockReturnValue('NEW_PASSWORD=');
      await resetAdminPasswordIfRequired();
      expect(Users.query.updateAsync).not.toHaveBeenCalled();
    });

    it('should not update password if password length is invalid', async () => {
      existsSync.mockReturnValue(true);
      readFileSync.mockReturnValue('NEW_PASSWORD=short');
      await resetAdminPasswordIfRequired();
      expect(Users.query.updateAsync).not.toHaveBeenCalled();
    });

    it('should update admin password and remove file', async () => {
      existsSync.mockReturnValue(true);
      readFileSync.mockReturnValue('NEW_PASSWORD=validPassword123');
      (Users.query.selectAsync as jest.Mock).mockResolvedValue([{ username: 'admin' }]);
      hashPassword.mockReturnValue('hashedPassword');

      await resetAdminPasswordIfRequired();

      expect(Users.query.updateAsync).toHaveBeenCalledWith(
        UsersCollectionName,
        { password: 'hashedPassword', updatedAt: expect.any(String) },
        { where: { username: 'admin' } }
      );
      expect(accessSync).toHaveBeenCalledWith(resetAdminPasswordFilePath);
      expect(unlinkSync).toHaveBeenCalledWith(resetAdminPasswordFilePath);
    });
  });

  describe('setupAdminAccount', () => {
    it('should create an admin account if it does not exist', () => {
      (Users.query.select as jest.Mock).mockReturnValue([]);
      hashPassword.mockReturnValue('hashedRootPassword');

      const result = setupAdminAccount();

      expect(Users.query.insert).toHaveBeenCalledWith(
        UsersCollectionName,
        expect.objectContaining({
          username: 'admin',
          displayName: 'Admin',
          password: 'hashedRootPassword',
          status: UserStatus.active,
          type: UserType.admin,
          permissions: [PermissionsType.ADMIN]
        })
      );
      expect(result.isAccountCreated).toBe(true);
    });

    it('should update existing admin account if already exists', () => {
      (Users.query.select as jest.Mock).mockReturnValue([{
        username: 'admin',
        displayName: 'Admin',
        password: 'someOldPassword',
        status: UserStatus.active,
        type: UserType.admin,
        permissions: [PermissionsType.ADMIN]
      }]);

      const result = setupAdminAccount();

      expect(Users.query.update).toHaveBeenCalledWith(
        UsersCollectionName,
        expect.objectContaining({
          status: UserStatus.active,
          permissions: [PermissionsType.ADMIN]
        }),
        { where: { username: 'admin' } }
      );
      expect(Users.query.insert).not.toHaveBeenCalled();
      expect(result.isAccountCreated).toBe(false);
    });
  });
});