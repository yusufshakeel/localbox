// ================ DO NOT CHANGE THE FOLLOWING ====================

import {minivium, SchemaRegistry} from 'minivium';
import {dataDir, DB_COLLECTIONS} from '@/configs/database/index';

const schemaRegistry = new SchemaRegistry({
  collections: [
    {
      name: DB_COLLECTIONS.Configs,
      columns: [
        { name: 'id', isUnique: true },
        { name: 'key', isRequired: true, isUnique: true },
        { name: 'value', isRequired: true }
      ]
    }
  ]
});

const config = {
  dataDir,
  schemaRegistry
};

export const db = minivium(config);
export const ConfigsCollectionName = DB_COLLECTIONS.Configs;
