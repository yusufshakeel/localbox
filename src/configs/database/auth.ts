import path from 'path';
import {minivium, SchemaRegistry} from 'minivium';
import {DATABASE_DIR} from '@/configs/database/index';
import {AUTH_FILENAME} from '@/configs/auth';

const dataDir = path.join(process.cwd(), DATABASE_DIR);

const schemaRegistry = new SchemaRegistry({
  collections: [
    {
      name: AUTH_FILENAME,
      columns: [
        { name: 'id', isUnique: true },
        { name: 'username', isRequired: true, isUnique: true },
        { name: 'password', isRequired: true },
        { name: 'accountType', isRequired: true },
        { name: 'accountStatus', isRequired: true },
        { name: 'rbac', isRequired: true },
        { name: 'createdAt', isRequired: true },
        { name: 'updatedAt' }
      ]
    }
  ]
});

export const authConfig = {
  dataDir,
  schemaRegistry
};

export const db = minivium(authConfig);