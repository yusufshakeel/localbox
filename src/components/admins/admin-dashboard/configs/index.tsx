import {useState} from 'react';
import ListConfigs from '@/components/admins/admin-dashboard/configs/ListConfigs';
import UpdateConfig from '@/components/admins/admin-dashboard/configs/UpdateConfig';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle} from 'lucide-react';
import {TOTAL_BYTES_IN_ONE_KILO_BYTE} from '@/configs/uploads';


export default function ConfigsComponent() {
  const [lastConfigChangesAt, setLastConfigChangesAt] = useState('');
  const [configToUpdate, setConfigToUpdate] = useState<any>(null);

  return (
    <div className="mt-5">
      <UpdateConfig
        configToUpdate={configToUpdate}
        setLastConfigChangesAt={setLastConfigChangesAt}
        setConfigToUpdate={setConfigToUpdate}
      />
      <ListConfigs
        lastConfigChangesAt={lastConfigChangesAt}
        setConfigToUpdate={setConfigToUpdate}
      />
      <div className="mt-3">
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            <p>Some configuration changes may require a server restart.</p>
            <p>Storage: 1 KB = {TOTAL_BYTES_IN_ONE_KILO_BYTE} Bytes</p>
            <p>Time: 1 Second = 1000 Milliseconds</p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}