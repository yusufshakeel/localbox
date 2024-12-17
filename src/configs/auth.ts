// ================ DO NOT CHANGE THE FOLLOWING ====================
export const JWT_SECRET = process.env.JWT_SECRET;
export const ACCESS_TOKEN_TTL_IN_MILLISECONDS = 60 * 60 * 1000;
export const REFRESH_TOKEN_TTL_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const PASSWORD_SALT_ROUND = 10;

// Set the JSON file name for the auth
export const AUTH_FILENAME = 'auth.json';

// Set the path for the auth JSON file
export const AUTH_FILE_PATH = `private/${AUTH_FILENAME}`;