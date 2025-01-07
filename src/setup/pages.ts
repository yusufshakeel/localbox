import {db, PagesCollectionName} from '@/configs/database/pages';
import {Pages} from '@/configs/pages';
import {Op} from 'minivium';
import {PageStatus, PageType} from '@/types/pages';
import {getISOStringDate} from '@/utils/date';

export function setupPages() {
  const pages = Object.values(Pages);
  const links = pages.map(v => v.link);

  const alreadyExistingPages = db.query.select(
    PagesCollectionName,
    { where: { link: { [Op.in]: links } } }
  );
  const alreadyExistingPageLinks = alreadyExistingPages.map(v => v.link);

  const createdAt = getISOStringDate();
  const updatedAt = getISOStringDate();

  const rowsToInsert = pages
    .filter(v => !alreadyExistingPageLinks.includes(v.link))
    .map(v => {
      return {
        link: v.link,
        title: v.title,
        permissions: v.permissions.sort(),
        type: PageType.inBuilt,
        status: PageStatus.active,
        createdAt
      };
    });

  const rowsToUpdate = pages
    .filter(v => alreadyExistingPageLinks.includes(v.link))
    .map(v => {
      return {
        link: v.link,
        title: v.title,
        permissions: v.permissions.sort(),
        type: PageType.inBuilt,
        status: PageStatus.active,
        updatedAt
      };
    });

  if (rowsToInsert.length) {
    db.query.bulkInsert(PagesCollectionName, rowsToInsert);
  }

  if (rowsToUpdate.length) {
    rowsToUpdate.map(rowToUpdate =>
      db.query.update(PagesCollectionName, rowToUpdate, { where: { link: rowToUpdate.link } })
    );
  }

  return pages.map(({ link, title }) => ({ link, title }));
}