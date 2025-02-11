import { signIn, signOut } from 'next-auth/react';
import { handleCredentialsSignIn, handleSignOut } from '@/services/auth-service';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn()
}));

describe('Authentication Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('handleCredentialsSignIn', () => {
    it('should call signIn with correct credentials', async () => {
      const credentials = { username: 'testUser', password: 'testPass' };
      await handleCredentialsSignIn(credentials);

      expect(signIn).toHaveBeenCalledWith('credentials', {
        username: 'testUser',
        password: 'testPass',
        callbackUrl: '/',
        redirectTo: '/'
      });
    });

    it('should handle signIn rejection', async () => {
      (signIn as jest.Mock).mockRejectedValue(new Error('Sign-in failed'));
      await expect(handleCredentialsSignIn({ username: 'testUser', password: 'wrongPass' }))
        .rejects.toThrow('Sign-in failed');
    });
  });

  describe('handleSignOut', () => {
    it('should call signOut with correct parameters', async () => {
      await handleSignOut();
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });

    it('should handle signOut rejection', async () => {
      (signOut as jest.Mock).mockRejectedValue(new Error('Sign-out failed'));
      await expect(handleSignOut()).rejects.toThrow('Sign-out failed');
    });
  });
});