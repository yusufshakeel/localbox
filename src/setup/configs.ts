import {db, ConfigsCollectionName} from '@/configs/database/configs';
import {Configs} from '@/configs';
import {Op} from 'minivium';

export function setupConfigs() {
  const keys = Configs.map(({key}) => key);

  const alreadyExistingConfigs = db.query.select(
    ConfigsCollectionName,
    { where: { key: { [Op.in]: keys } } }
  );
  const alreadyExistingConfigKeys = alreadyExistingConfigs.map(({key}) => key);

  const rowsToInsert = Configs
    .filter(v => !alreadyExistingConfigKeys.includes(v.key))
    .map(({key, value}) => {
      return {
        key,
        value
      };
    });

  if (rowsToInsert.length) {
    db.query.bulkInsert(ConfigsCollectionName, rowsToInsert);
  }

  return Configs.map(({ key, value }) => ({ key, value }));
}