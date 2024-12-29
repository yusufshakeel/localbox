'use strict';
import {minivium, SchemaRegistry} from 'minivium';
import path from 'path';

const collectionName = 'page_permissions';

const db = minivium({
  dataDir: path.join(process.cwd(), 'private/db'),
  schemaRegistry: new SchemaRegistry({
    collections: [
      {
        name: collectionName,
        columns: [
          { name: 'id', isUnique: true },
          { name: 'pageUrl', isRequired: true, isUnique: true },
          { name: 'permissions', isRequired: true },
          { name: 'pageType', isRequired: true },
          { name: 'createdAt', isRequired: true },
          { name: 'updatedAt' }
        ]
      }
    ]
  })
});

async function setupPagePermissions() {
  db.init();
  
  const createdAt = new Date().toISOString();

  const data = [
    { pageUrl: 'uploads', permissions: ['uploads:view', 'uploads:upload-file'], pageType: 'default', createdAt },
    { pageUrl: 'images', permissions: ['images:view'], pageType: 'default', createdAt },
    { pageUrl: 'audios', permissions: ['audios:view'], pageType: 'default', createdAt },
    { pageUrl: 'videos', permissions: ['videos:view'], pageType: 'default', createdAt },
    { pageUrl: 'documents', permissions: ['documents:view'], pageType: 'default', createdAt },
    { pageUrl: 'temp-chats', permissions: ['temp-chats:use'], pageType: 'default', createdAt },
    { pageUrl: 'profile', permissions: ['profile:use'], pageType: 'default', createdAt }
  ];

  data.forEach(d => {
    const where = { where: { pageUrl: d.pageUrl } };
    if (db.query.select(collectionName, where).length) {
      db.query.update(collectionName, { ...d, updatedAt: new Date().toISOString() }, where);
    } else {
      db.query.insert(collectionName, d);
    }
  });

  // eslint-disable-next-line
  console.log('Created page permissions.');
}

setupPagePermissions();