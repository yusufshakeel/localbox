// ================ DO NOT CHANGE THE FOLLOWING ====================
import {minivium, SchemaRegistry} from 'minivium';
import path from 'path';
import {DATABASE_DIR, DB_COLLECTIONS} from '@/configs/database/index';

const dataDir = path.join(process.cwd(), DATABASE_DIR);

const schemaRegistry = new SchemaRegistry({
  collections: [
    {
      name: DB_COLLECTIONS.Users,
      columns: [
        { name: 'id', isUnique: true },
        { name: 'username', isRequired: true },
        { name: 'displayName', isRequired: true },
        { name: 'password', isRequired: true },
        { name: 'status', isRequired: true },
        { name: 'type', isRequired: true },
        { name: 'permissions', isRequired: true },
        { name: 'createdAt', isRequired: true },
        { name: 'updatedAt' }
      ]
    }
  ]
});

const config = {
  dataDir,
  schemaRegistry
};

export const db = minivium(config);
export const UsersCollectionName = DB_COLLECTIONS.Users;