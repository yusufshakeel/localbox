import { db } from '../../../src/configs/database/pages';
import { setupPages } from '@/setup/pages';

jest.mock('../../../src/configs/database/pages', () => ({
  db: {
    query: {
      select: jest.fn(),
      bulkInsert: jest.fn(),
      update: jest.fn()
    }
  },
  PagesCollectionName: 'pages'
}));

jest.mock('../../../src/configs/pages', () => ({
  Pages: {
    home: { id: '1', link: '/home', title: 'Home', pageFor: 'all', permissions: ['read'] },
    about: { id: '2', link: '/about', title: 'About', pageFor: 'all', permissions: ['read', 'write'] }
  }
}));

jest.mock('../../../src/utils/date', () => ({
  getISOStringDate: jest.fn(() => '2025-02-11T00:00:00.000Z')
}));

describe('setupPages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should insert new pages if they do not exist', () => {
    (db.query.select as jest.Mock).mockReturnValue([]);

    setupPages();

    expect(db.query.bulkInsert).toHaveBeenCalledWith(
      'pages',
      [
        {
          createdAt: '2025-02-11T00:00:00.000Z',
          id: '1',
          link: '/home',
          pageFor: 'all',
          permissions: ['read'],
          status: 'active',
          title: 'Home',
          type: 'inBuilt'
        },
        {
          createdAt: '2025-02-11T00:00:00.000Z',
          id: '2',
          link: '/about',
          pageFor: 'all',
          permissions: ['read', 'write'],
          status: 'active',
          title: 'About',
          type: 'inBuilt'
        }
      ]
    );
  });

  it('should update existing pages if they already exist', () => {
    (db.query.select as jest.Mock).mockReturnValue([{ link: '/home' }]);

    setupPages();

    expect(db.query.update).toHaveBeenCalledWith(
      'pages',
      {
        id: '1',
        link: '/home',
        pageFor: 'all',
        permissions: ['read'],
        status: 'active',
        title: 'Home',
        type: 'inBuilt',
        updatedAt: '2025-02-11T00:00:00.000Z'
      },
      {where: {link: '/home'}}
    );
  });

  it('should return an array of page links and titles', () => {
    (db.query.select as jest.Mock).mockReturnValue([]);

    const result = setupPages();

    expect(result).toEqual([
      { link: '/home', title: 'Home' },
      { link: '/about', title: 'About' }
    ]);
  });

  it('should not insert but update pages if there are no changes', () => {
    (db.query.select as jest.Mock).mockReturnValue([
      { link: '/home' },
      { link: '/about' }
    ]);

    setupPages();

    expect(db.query.bulkInsert).not.toHaveBeenCalled();
    expect(db.query.update).toHaveBeenNthCalledWith(
      1,
      'pages',
      {
        id: '1',
        link: '/home',
        pageFor: 'all',
        permissions: ['read'],
        status: 'active',
        title: 'Home',
        type: 'inBuilt',
        updatedAt: '2025-02-11T00:00:00.000Z'
      },
      {where: {link: '/home'}}
    );
    expect(db.query.update).toHaveBeenNthCalledWith(
      2,
      'pages',
      {
        id: '2',
        link: '/about',
        pageFor: 'all',
        permissions: ['read', 'write'],
        status: 'active',
        title: 'About',
        type: 'inBuilt',
        updatedAt: '2025-02-11T00:00:00.000Z'
      },
      {where: {link: '/about'}}
    );
  });
});
