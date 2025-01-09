import BaseLayout from '@/layouts/BaseLayout';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {useSession} from 'next-auth/react';
import FileUploadComponent from '@/components/FileUploadComponent';
import {AcceptFileType} from '@/types/file';
import {useState} from 'react';

function Documents() {
  const {data: session} = useSession() as any;
  const [lastUploadAt, setLastUploadAt] = useState<string>('');

  return (
    <BaseLayout pageTitle={Pages.documents.title}>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session?.user?.permissions,
            [`${Pages.documents.id}:${PermissionsType.AUTHORIZED_USE}`]
          ) &&
            <div className="col-span-12 lg:col-span-5 mb-10">
              <FileUploadComponent
                setLastUploadAt={setLastUploadAt}
                dir={PublicFolders.documents}
                acceptFileType={AcceptFileType.document}/>
            </div>
        }
      </div>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session?.user?.permissions,
            [`${Pages.documents.id}:${PermissionsType.AUTHORIZED_VIEW}`]
          ) && (
            <div className="col-span-12 lg:col-span-9 mb-10">
              <ListDirectoryFiles
                dir={PublicFolders.documents}
                sort={'DESC'}
                lastUploadAt={lastUploadAt}
              />
            </div>
          )
        }
      </div>
    </BaseLayout>
  );
}

export default WithAuth(Documents, {
  permissions: Pages.documents.permissions
});