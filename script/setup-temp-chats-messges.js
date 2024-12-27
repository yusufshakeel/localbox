'use strict';
import {minivium, SchemaRegistry} from 'minivium';
import path from 'path';

const db = minivium({
  dataDir: path.join(process.cwd(), 'private/db'),
  schemaRegistry: new SchemaRegistry({
    collections: [
      {
        name: 'temp_chats_messages',
        columns: [] // since we are only initialising the collection so columns = []
      }
    ]
  })
});

async function setupTempChatsMessages() {
  db.init();
  // eslint-disable-next-line
  console.log('TempChats setup done.');
}

setupTempChatsMessages();