// ================ DO NOT CHANGE THE FOLLOWING ====================
import {minivium, SchemaRegistry} from 'minivium';
import path from 'path';
import {DATABASE_DIR, DB_COLLECTIONS} from '@/configs/database/index';

const dataDir = path.join(process.cwd(), DATABASE_DIR);

const schemaRegistry = new SchemaRegistry({
  collections: [
    {
      name: DB_COLLECTIONS.TempChatsMessages,
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
export const TempChatsMessagesCollectionName = DB_COLLECTIONS.TempChatsMessages;