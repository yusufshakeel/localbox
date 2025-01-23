import {useState} from 'react';
import ListConfigs from '@/components/admins/admin-dashboard/configs/ListConfigs';
import UpdateConfig from '@/components/admins/admin-dashboard/configs/UpdateConfig';


export default function ConfigsComponent() {
  const [lastConfigChangesAt, setLastConfigChangesAt] = useState('');
  const [configToUpdate, setConfigToUpdate] = useState<any>(null);

  return (
    <div className="mt-5">
      <p className="my-5 text-sm text-muted-foreground">
        Some configuration changes may require a server restart.
      </p>
      <UpdateConfig
        configToUpdate={configToUpdate}
        setLastConfigChangesAt={setLastConfigChangesAt}
        setConfigToUpdate={setConfigToUpdate}
      />
      <ListConfigs
        lastConfigChangesAt={lastConfigChangesAt}
        setConfigToUpdate={setConfigToUpdate}
      />
    </div>
  );
}