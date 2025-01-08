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

export const userCreateSchema = z.object({
  username: z.string({ required_error: 'Username is required' })
    .min(AUTH_USERNAME_MIN_LENGTH, `Username must have at least ${AUTH_USERNAME_MIN_LENGTH} characters`)
    .max(AUTH_USERNAME_MAX_LENGTH, `Username cannot have more than ${AUTH_USERNAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
  displayName: z.string({ required_error: 'Display name is required' })
    .min(AUTH_DISPLAY_NAME_MIN_LENGTH, `Display name must have at least ${AUTH_DISPLAY_NAME_MIN_LENGTH} characters`)
    .max(AUTH_DISPLAY_NAME_MAX_LENGTH, `Display name cannot have more than ${AUTH_DISPLAY_NAME_MAX_LENGTH} characters`),
  password: z.string({ required_error: 'Password is required' })
    .min(AUTH_PASSWORD_MIN_LENGTH, `Password must have at least ${AUTH_PASSWORD_MIN_LENGTH} characters`)
    .max(AUTH_PASSWORD_MAX_LENGTH, `Password cannot have more than ${AUTH_PASSWORD_MAX_LENGTH} characters`)
});

export const userUpdateSchema = z.object({
  username: z.string()
    .min(AUTH_USERNAME_MIN_LENGTH, `Username must have at least ${AUTH_USERNAME_MIN_LENGTH} characters`)
    .max(AUTH_USERNAME_MAX_LENGTH, `Username cannot have more than ${AUTH_USERNAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
  displayName: z.string()
    .min(AUTH_DISPLAY_NAME_MIN_LENGTH, `Display name must have at least ${AUTH_DISPLAY_NAME_MIN_LENGTH} characters`)
    .max(AUTH_DISPLAY_NAME_MAX_LENGTH, `Display name cannot have more than ${AUTH_DISPLAY_NAME_MAX_LENGTH} characters`),
  status: z.enum([UserStatus.active, UserStatus.suspend])
});

export const userUpdatePasswordSchema = z.object({
  password: z.string()
    .min(AUTH_PASSWORD_MIN_LENGTH, `Password must have at least ${AUTH_PASSWORD_MIN_LENGTH} characters`)
    .max(AUTH_PASSWORD_MAX_LENGTH, `Password cannot have more than ${AUTH_PASSWORD_MAX_LENGTH} characters`)
});

export const userUpdatePermissionsSchema = z.object({
  permissions: z.array(z.string())
});