import path from 'path';
import {minivium, SchemaRegistry} from 'minivium';
import {DATABASE_DIR} from '@/configs/database/index';
import {PAGE_PERMISSIONS_FILENAME} from '@/configs/pages';

const dataDir = path.join(process.cwd(), DATABASE_DIR);

const schemaRegistry = new SchemaRegistry({
  collections: [
    {
      name: PAGE_PERMISSIONS_FILENAME,
      columns: [
        { name: 'id', isUnique: true },
        { name: 'pageId', isRequired: true, isUnique: true },
        { name: 'permissions', isRequired: true },
        { name: 'pageType', isRequired: true },
        { name: 'createdAt', isRequired: true },
        { name: 'updatedAt' }
      ]
    }
  ]
});

export const pagePermissionsConfig = {
  dataDir,
  schemaRegistry
};

export const db = minivium(pagePermissionsConfig);