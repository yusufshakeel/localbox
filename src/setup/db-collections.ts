import {
  db as TempChatsMessages,
  TempChatsMessagesCollectionName
} from '@/configs/database/temp-chats-messages';
import {db as Users, UsersCollectionName} from '@/configs/database/users';

export function initDbCollections() {
  TempChatsMessages.init();
  Users.init();

  return {
    dbCollections: [TempChatsMessagesCollectionName, UsersCollectionName].sort()
  };
}