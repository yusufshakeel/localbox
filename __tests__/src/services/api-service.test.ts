import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import {
  isAllowedMethod,
  isValidSessionWithPermissions,
  hasApiPrivileges,
  hasAdminApiPrivileges
} from '@/services/api-service';
import { UserStatus, UserType } from '@/types/users';
import { PermissionsType } from '@/types/permissions';
import { db } from './../../../src/configs/database/users';

jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
jest.mock('./../../../src/configs/database/users', () => ({
  db: {
    query: {
      selectAsync: jest.fn()
    }
  },
  UsersCollectionName: 'users'
}));

describe('API Privileges Utilities', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  const end = jest.fn();
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock, end }));
    res = { status: statusMock, setHeader: jest.fn() };
    req = { method: 'GET' };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isAllowedMethod', () => {
    it('should allow valid methods', () => {
      expect(isAllowedMethod(req as NextApiRequest, res as NextApiResponse, ['GET'])).toBe(true);
    });

    it('should reject invalid methods with 405', () => {
      req.method = 'POST';

      isAllowedMethod(req as NextApiRequest, res as NextApiResponse, ['GET']);

      expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
      expect(statusMock).toHaveBeenCalledWith(405);
      expect(end).toHaveBeenCalledWith('Method POST Not Allowed');
    });
  });

  describe('isValidSessionWithPermissions', () => {
    it('should return 401 if no session exists', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      await isValidSessionWithPermissions(
        req as NextApiRequest,
        res as NextApiResponse,
        { allowedUserTypes: [UserType.admin], allowedPermissions: [] }
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return 401 if user does not exist in DB', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '123' } });
      (db.query.selectAsync as jest.Mock).mockResolvedValue([]);

      await isValidSessionWithPermissions(
        req as NextApiRequest,
        res as NextApiResponse,
        { allowedUserTypes: [UserType.admin], allowedPermissions: [] }
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return 403 if user lacks required permissions', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '123' } });
      (db.query.selectAsync as jest.Mock).mockResolvedValue([{ id: '123', type: UserType.user, permissions: [], status: UserStatus.active }]);

      await isValidSessionWithPermissions(
        req as NextApiRequest,
        res as NextApiResponse,
        { allowedUserTypes: [UserType.admin], allowedPermissions: [PermissionsType.ADMIN] }
      );

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Forbidden: Do not have required permissions.' });
    });

    it('should return session with user data if valid', async () => {
      const mockSession = { user: { id: '123' } };
      const mockUser = { id: '123', type: UserType.admin, permissions: [PermissionsType.ADMIN], status: UserStatus.active };

      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (db.query.selectAsync as jest.Mock).mockResolvedValue([mockUser]);

      const result = await isValidSessionWithPermissions(
        req as NextApiRequest,
        res as NextApiResponse,
        { allowedUserTypes: [UserType.admin], allowedPermissions: [PermissionsType.ADMIN] }
      );

      expect(result).toEqual({ ...mockSession, user: { ...mockSession.user, ...mockUser } });
    });
  });

  describe('hasApiPrivileges', () => {
    it('should return early if method is not allowed', async () => {
      req.method = 'POST';

      await hasApiPrivileges(req as NextApiRequest, res as NextApiResponse, { allowedMethods: ['GET'], permissions: [] });

      expect(statusMock).toHaveBeenCalledWith(405);
    });

    it('should return early if session does not exists', async () => {
      const mockUser = { id: '123', type: UserType.admin, permissions: [PermissionsType.ADMIN], status: UserStatus.active };

      (getServerSession as jest.Mock).mockResolvedValue(null);
      (db.query.selectAsync as jest.Mock).mockResolvedValue([mockUser]);

      await hasApiPrivileges(req as NextApiRequest, res as NextApiResponse, { allowedMethods: ['GET'], permissions: [PermissionsType.ADMIN] });

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return session if valid', async () => {
      const mockSession = { user: { id: '123' } };
      const mockUser = { id: '123', type: UserType.admin, permissions: [PermissionsType.ADMIN], status: UserStatus.active };

      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (db.query.selectAsync as jest.Mock).mockResolvedValue([mockUser]);

      const result = await hasApiPrivileges(req as NextApiRequest, res as NextApiResponse, { allowedMethods: ['GET'], permissions: [PermissionsType.ADMIN] });

      expect(result).toEqual({ ...mockSession, user: { ...mockSession.user, ...mockUser } });
    });
  });

  describe('hasAdminApiPrivileges', () => {
    it('should return early if method is not allowed', async () => {
      req.method = 'POST';

      await hasAdminApiPrivileges(req as NextApiRequest, res as NextApiResponse, { allowedMethods: ['GET'] });

      expect(statusMock).toHaveBeenCalledWith(405);
    });

    it('should return early if session does not exists', async () => {
      const mockUser = { id: '123', type: UserType.admin, permissions: [PermissionsType.ADMIN], status: UserStatus.active };

      (getServerSession as jest.Mock).mockResolvedValue(null);
      (db.query.selectAsync as jest.Mock).mockResolvedValue([mockUser]);

      await hasAdminApiPrivileges(
        req as NextApiRequest,
        res as NextApiResponse,
        { allowedMethods: ['GET'] }
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return session if user is admin with valid permissions', async () => {
      const mockSession = { user: { id: '123' } };
      const mockUser = { id: '123', type: UserType.admin, permissions: [PermissionsType.ADMIN], status: UserStatus.active };

      (getServerSession as jest.Mock).mockResolvedValue(mockSession);
      (db.query.selectAsync as jest.Mock).mockResolvedValue([mockUser]);

      const result = await hasAdminApiPrivileges(req as NextApiRequest, res as NextApiResponse, { allowedMethods: ['GET'] });

      expect(result).toEqual({ ...mockSession, user: { ...mockSession.user, ...mockUser } });
    });
  });
});
