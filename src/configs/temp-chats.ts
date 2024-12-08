// ================ You can set the following ====================

// Set the TTL (in milliseconds) for the messages
export const TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS = 30 * 60 * 1000;

// Set max character limit for the display name of the user
export const TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME_MAX_LENGTH = 20;

// ================ DO NOT CHANGE THE FOLLOWING ====================

// Set the JSON file name for the messages
export const TEMP_CHATS_MESSAGES_FILENAME = 'temp-chats-messages.json'

// Set the path for the messages JSON file
export const TEMP_CHATS_MESSAGES_FILE_PATH = `private/${TEMP_CHATS_MESSAGES_FILENAME}`;

// Set user id and display name
export const TEMP_CHATS_MESSAGES_USER_ID = 'TEMP_CHATS_MESSAGES_USER_ID';
export const TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME = 'TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME';

// This will be a boolean value that will be set by the application
export const TEMP_CHATS_MESSAGES_USER_LOGGED_IN = 'TEMP_CHATS_MESSAGES_USER_LOGGED_IN';