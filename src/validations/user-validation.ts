import {z} from 'zod';
import {
  AUTH_DISPLAY_NAME_MAX_LENGTH,
  AUTH_DISPLAY_NAME_MIN_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
  AUTH_USERNAME_MAX_LENGTH,
  AUTH_USERNAME_MIN_LENGTH
} from '@/configs/auth';
import {UserStatus} from '@/types/users';

const getUsernameZodString = () => {
  const zodString = z.string({ required_error: 'Username is required' });
  return zodString
    .min(AUTH_USERNAME_MIN_LENGTH, `Username must have at least ${AUTH_USERNAME_MIN_LENGTH} characters`)
    .max(AUTH_USERNAME_MAX_LENGTH, `Username cannot have more than ${AUTH_USERNAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric');
};

const getDisplayNameZodString = () => {
  const zodString = z.string({ required_error: 'Display name is required' });
  return zodString
    .min(AUTH_DISPLAY_NAME_MIN_LENGTH, `Display name must have at least ${AUTH_DISPLAY_NAME_MIN_LENGTH} characters`)
    .max(AUTH_DISPLAY_NAME_MAX_LENGTH, `Display name cannot have more than ${AUTH_DISPLAY_NAME_MAX_LENGTH} characters`);
};

const getPasswordZodString = () => {
  const zodString = z.string({ required_error: 'Password is required' });
  return zodString
    .min(AUTH_PASSWORD_MIN_LENGTH, `Password must have at least ${AUTH_PASSWORD_MIN_LENGTH} characters`)
    .max(AUTH_PASSWORD_MAX_LENGTH, `Password cannot have more than ${AUTH_PASSWORD_MAX_LENGTH} characters`)
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter.')
    .regex(/\d/, 'Password must contain at least one digit.');
};

export const userCreateSchema = z.object({
  username: getUsernameZodString(),
  displayName: getDisplayNameZodString(),
  password: getPasswordZodString()
});

export const userUpdateSchema = z.object({
  username: getUsernameZodString(),
  displayName: getDisplayNameZodString(),
  status: z.enum([UserStatus.active, UserStatus.suspended]),
  personalDriveStorageLimit: z.string()
    .min(1, 'Personal Drive storage limit is required')
    .regex(/^[0-9]+$/, 'Personal Drive storage limit must be a whole number')
    .optional()
});

export const userUpdatePasswordSchema = z.object({
  password: getPasswordZodString()
});

export const userUpdatePermissionsSchema = z.object({
  permissions: z.array(z.string())
});

export const userUpdateProfileDetailsSchema = z.object({
  displayName: getDisplayNameZodString()
});