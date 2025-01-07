import {
  db as TempChatsMessages,
  TempChatsMessagesCollectionName
} from '@/configs/database/temp-chats-messages';
import {db as Users, UsersCollectionName} from '@/configs/database/users';
import {db as Pages, PagesCollectionName} from '@/configs/database/pages';

export function initDbCollections() {
  TempChatsMessages.init();
  Users.init();
  Pages.init();

  return {
    dbCollections: [
      TempChatsMessagesCollectionName, UsersCollectionName, PagesCollectionName
    ].sort()
  };
}