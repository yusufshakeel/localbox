// ================ DO NOT CHANGE THE FOLLOWING ====================

import {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS} from '@/configs/temp-chats';
import {FILE_UPLOAD_MAX_SIZE_IN_BYTES} from '@/configs/uploads';
import {AUTH_SESSION_MAX_AGE_IN_SECONDS} from '@/configs/auth';

export const LOCALBOX_SETUP_LOCK_FILENAME = 'setup.lock';

export const Configs = [
  {
    key: 'AUTH_SESSION_MAX_AGE_IN_SECONDS',
    value: AUTH_SESSION_MAX_AGE_IN_SECONDS
  },
  {
    key: 'FILE_UPLOAD_MAX_SIZE_IN_BYTES',
    value: FILE_UPLOAD_MAX_SIZE_IN_BYTES
  },
  {
    key: 'TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS',
    value: TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS
  }
];
