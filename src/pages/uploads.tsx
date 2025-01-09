import BaseLayout from '@/layouts/BaseLayout';
import FileUploadComponent from '@/components/FileUploadComponent';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {useState} from 'react';
import {Pages} from '@/configs/pages';
import {useSession} from 'next-auth/react';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';

function Uploads() {
  const [lastUploadAt, setLastUploadAt] = useState<string>('');
  const {data: session} = useSession() as any;

  return (
    <BaseLayout pageTitle={Pages.uploads.title}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 mb-10">
          {
            hasPermissions(
              session?.user?.permissions,
              [`${Pages.uploads.id}:${PermissionsType.AUTHORIZED_USE}`]
            ) && <FileUploadComponent setLastUploadAt={setLastUploadAt}/>
          }
        </div>
        <div className="col-span-12 lg:col-span-7 mb-10">
          {
            hasPermissions(
              session?.user?.permissions,
              [`${Pages.uploads.id}:${PermissionsType.AUTHORIZED_VIEW}`]
            ) && <ListDirectoryFiles
              dir={PublicFolders.uploads}
              sort={'DESC'}
              lastUploadAt={lastUploadAt}
            />
          }
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(Uploads, {
  permissions: Pages.uploads.permissions
});
