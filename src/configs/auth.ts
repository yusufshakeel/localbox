// ================ DO NOT CHANGE THE FOLLOWING ====================
export const JWT_SECRET = process.env.JWT_SECRET;
export const ACCESS_TOKEN_TTL_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
export const REFRESH_TOKEN_TTL_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const PASSWORD_SALT_ROUND = 10;

// Set the JSON file name for the auth
export const AUTH_FILENAME = 'auth';

export const AUTH_USERNAME_MAX_LENGTH = 20;
export const AUTH_PASSWORD_MIN_LENGTH = 8;