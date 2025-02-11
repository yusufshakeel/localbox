import { db } from '../../../src/configs/database/configs';
import { setupConfigs } from '@/setup/configs';

jest.mock('../../../src/configs/database/configs', () => ({
  db: {
    query: {
      select: jest.fn(),
      bulkInsert: jest.fn()
    }
  },
  ConfigsCollectionName: 'configs'
}));

jest.mock('../../../src/configs/index', () => ({
  Configs: [
    { key: 'featureFlag', value: true },
    { key: 'maxUsers', value: 100 }
  ]
}));

describe('setupConfigs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the default configurations', () => {
    (db.query.select as jest.Mock).mockReturnValue([]);

    const result = setupConfigs();

    expect(result).toEqual([
      { key: 'featureFlag', value: true },
      { key: 'maxUsers', value: 100 }
    ]);
  });

  it('should not insert anything if all configs already exist', () => {
    (db.query.select as jest.Mock).mockReturnValue([
      { key: 'featureFlag', value: true },
      { key: 'maxUsers', value: 100 }
    ]);

    setupConfigs();

    expect(db.query.bulkInsert).not.toHaveBeenCalled();
  });

  it('should insert missing configs', () => {
    (db.query.select as jest.Mock).mockReturnValue([{ key: 'featureFlag', value: true }]);

    setupConfigs();

    expect(db.query.bulkInsert).toHaveBeenCalledWith('configs', [
      { key: 'maxUsers', value: 100 }
    ]);
  });

  it('should handle empty configs gracefully', () => {
    (db.query.select as jest.Mock).mockReturnValue([]);
    (jest.requireMock('../../../src/configs/index').Configs as any) = [];

    const result = setupConfigs();

    expect(result).toEqual([]);
    expect(db.query.bulkInsert).not.toHaveBeenCalled();
  });
});
