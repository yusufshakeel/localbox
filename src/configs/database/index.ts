// ================ DO NOT CHANGE THE FOLLOWING ====================

import path from 'path';
import {PrivateFolder, PrivateFolders} from '@/configs/folders';

export const DATABASE_DIR = `${PrivateFolder}/${PrivateFolders.db}`;

export const dataDir = path.join(process.cwd(), DATABASE_DIR);

export const DB_COLLECTIONS = {
  Configs: 'Configs',
  Pages: 'Pages',
  TempChatsMessages: 'TempChatsMessages',
  Users: 'Users'
};