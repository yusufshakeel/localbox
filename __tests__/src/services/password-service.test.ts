import bcrypt from 'bcrypt';
import PasswordService from '@/services/password-service';
import { PASSWORD_SALT_ROUND } from '@/configs/auth';

jest.mock('bcrypt');

describe('PasswordService', () => {
  const plainTextPassword = 'securePassword123';
  const hashedPassword = 'hashedPassword';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password correctly', () => {
      (bcrypt.genSaltSync as jest.Mock).mockReturnValue('salt');
      (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword);

      const result = PasswordService.hashPassword(plainTextPassword);

      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(PASSWORD_SALT_ROUND);
      expect(bcrypt.hashSync).toHaveBeenCalledWith(plainTextPassword, 'salt');
      expect(result).toBe(hashedPassword);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for valid password', () => {
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const result = PasswordService.isValidPassword(plainTextPassword, hashedPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(plainTextPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for invalid password', () => {
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      const result = PasswordService.isValidPassword('wrongPassword', hashedPassword);

      expect(bcrypt.compareSync).toHaveBeenCalledWith('wrongPassword', hashedPassword);
      expect(result).toBe(false);
    });
  });
});
