import { db as TempChatsMessages } from '../../../src/configs/database/temp-chats-messages';
import { db as Users } from '../../../src/configs/database/users';
import { db as Pages } from '../../../src/configs/database/pages';
import { db as Configs } from '../../../src/configs/database/configs';
import { initDbCollections } from '@/setup/db-collections';

jest.mock('../../../src/configs/database/temp-chats-messages', () => ({
  db: { init: jest.fn() },
  TempChatsMessagesCollectionName: 'temp_chats_messages'
}));

jest.mock('../../../src/configs/database/users', () => ({
  db: { init: jest.fn() },
  UsersCollectionName: 'users'
}));

jest.mock('../../../src/configs/database/pages', () => ({
  db: { init: jest.fn() },
  PagesCollectionName: 'pages'
}));

jest.mock('../../../src/configs/database/configs', () => ({
  db: { init: jest.fn() },
  ConfigsCollectionName: 'configs'
}));

describe('initDbCollections', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize all database collections', () => {
    const result = initDbCollections();

    expect(TempChatsMessages.init).toHaveBeenCalled();
    expect(Users.init).toHaveBeenCalled();
    expect(Pages.init).toHaveBeenCalled();
    expect(Configs.init).toHaveBeenCalled();
    expect(result).toEqual({
      dbCollections: ['configs', 'pages', 'temp_chats_messages', 'users'].sort()
    });
  });

  it('should return the correct sorted list of database collections', () => {
    const result = initDbCollections();

    expect(result.dbCollections).toEqual(['configs', 'pages', 'temp_chats_messages', 'users'].sort());
  });
});
