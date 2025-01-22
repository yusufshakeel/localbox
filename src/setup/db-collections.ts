import {
  db as TempChatsMessages,
  TempChatsMessagesCollectionName
} from '@/configs/database/temp-chats-messages';
import {db as Users, UsersCollectionName} from '@/configs/database/users';
import {db as Pages, PagesCollectionName} from '@/configs/database/pages';
import {db as Configs, ConfigsCollectionName} from '@/configs/database/configs';

export function initDbCollections() {
  TempChatsMessages.init();
  Users.init();
  Pages.init();
  Configs.init();

  return {
    dbCollections: [
      ConfigsCollectionName,
      PagesCollectionName,
      TempChatsMessagesCollectionName,
      UsersCollectionName
    ].sort()
  };
}