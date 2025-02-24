// ================ DO NOT CHANGE THE FOLLOWING ====================

import {minivium, SchemaRegistry} from 'minivium';
import {dataDir, DB_COLLECTIONS} from '@/configs/database/index';

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

export const tempChatsMessagesConfig = {
  dataDir,
  schemaRegistry
};

export const db = minivium(tempChatsMessagesConfig);
export const TempChatsMessagesCollectionName = DB_COLLECTIONS.TempChatsMessages;