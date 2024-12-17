import bcrypt from 'bcrypt';
import {PASSWORD_SALT_ROUND} from '@/configs/auth';

const hashPassword = (plainTextPassword: string): string => {
  const salt = bcrypt.genSaltSync(PASSWORD_SALT_ROUND);
  return bcrypt.hashSync(plainTextPassword, salt);
};

const isValidPassword = (plainTestPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(plainTestPassword, hashedPassword);
};

const PasswordService = {
  hashPassword,
  isValidPassword
};

export default PasswordService;