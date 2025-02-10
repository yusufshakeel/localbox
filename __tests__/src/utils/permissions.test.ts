import { hasPermissions, isLoggedInSessionForAdmin, isLoggedInSessionForUser } from '@/utils/permissions';

describe('Permissions', () => {
  describe('hasPermissions', () => {
    test('should return true if user has the required permissions', () => {
      const userData = {user: {permissions: ['READ', 'WRITE']}};
      expect(hasPermissions(userData, ['READ'])).toBeTruthy();
    });

    test('should return true if user has admin permission', () => {
      const userData = {user: {permissions: ['ADMIN']}};
      expect(hasPermissions(userData, ['READ'])).toBeTruthy();
    });

    test('should return false if user does not have required permissions', () => {
      const userData = {user: {permissions: ['READ']}};
      expect(hasPermissions(userData, ['WRITE'])).toBeFalsy();
    });

    test('should return false if user permissions are undefined', () => {
      const userData = {} as any;
      expect(hasPermissions(userData, ['READ'])).toBeFalsy();
    });
  });

  describe('isLoggedInSessionForAdmin', () => {
    test('should return true if session user is an admin', () => {
      const session = {user: {type: 'admin'}};
      expect(isLoggedInSessionForAdmin(session)).toBeTruthy();
    });

    test('should return false if session user is not an admin', () => {
      const session = {user: {type: 'user'}};
      expect(isLoggedInSessionForAdmin(session)).toBeFalsy();
    });

    test('should return false if session is undefined', () => {
      expect(isLoggedInSessionForAdmin(undefined)).toBeFalsy();
    });
  });

  describe('isLoggedInSessionForUser', () => {
    test('should return true if session user is a user', () => {
      const session = {user: {type: 'user'}};
      expect(isLoggedInSessionForUser(session)).toBeTruthy();
    });

    test('should return false if session user is not a user', () => {
      const session = {user: {type: 'admin'}};
      expect(isLoggedInSessionForUser(session)).toBeFalsy();
    });

    test('should return false if session is undefined', () => {
      expect(isLoggedInSessionForUser(undefined)).toBeFalsy();
    });
  });
});