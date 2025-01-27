// ================ DO NOT CHANGE THE FOLLOWING ====================

import {minivium, SchemaRegistry} from 'minivium';
import {dataDir, DB_COLLECTIONS} from '@/configs/database/index';

const schemaRegistry = new SchemaRegistry({
  collections: [
    {
      name: DB_COLLECTIONS.Pages,
      columns: [
        { name: 'id', isUnique: true },
        { name: 'link', isRequired: true, isUnique: true },
        { name: 'title', isRequired: true },
        { name: 'pageFor', isRequired: true },
        { name: 'permissions', isRequired: true },
        { name: 'type', isRequired: true },
        { name: 'status', isRequired: true },
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
export const PagesCollectionName = DB_COLLECTIONS.Pages;