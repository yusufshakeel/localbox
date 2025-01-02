// ================ DO NOT CHANGE THE FOLLOWING ====================
import {minivium, SchemaRegistry} from 'minivium';
import {TEMP_CHATS_MESSAGES_FILENAME} from '@/configs/temp-chats';
import path from 'path';
import {DATABASE_DIR} from '@/configs/database/index';

const dataDir = path.join(process.cwd(), DATABASE_DIR);

const schemaRegistry = new SchemaRegistry({
  collections: [
    {
      name: TEMP_CHATS_MESSAGES_FILENAME,
      columns: [
        { name: 'id', isUnique: true },
        { name: 'userId', isRequired: true },
        { name: 'displayName', isRequired: true },
        { name: 'message', isRequired: true },
        { name: 'type', isRequired: true },
        { name: 'timestamp', isRequired: true }
      ]
    }
  ]
});

export const tempChatMessagesConfig = {
  dataDir,
  schemaRegistry
};

export const db = minivium(tempChatMessagesConfig);