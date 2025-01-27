import BaseLayout from '@/layouts/BaseLayout';
import {Pages} from '@/configs/pages';
import {WithAuth} from '@/components/with-auth';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {useSession} from 'next-auth/react';
import ListFiles from '@/components/personal-drive/ListFiles';
import FileUploadComponent from '@/components/FileUploadComponent';
import {AcceptFileType} from '@/types/file';
import {useState} from 'react';

function PersonalDrive() {
  const {data: session} = useSession() as any;
  const [lastUploadAt, setLastUploadAt] = useState<string>('');

  return (
    <BaseLayout pageTitle={Pages.personalDrive.title}>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}`]
          ) &&
          <div className="col-span-12 lg:col-span-5">
            <FileUploadComponent
              setLastUploadAt={setLastUploadAt}
              acceptFileType={AcceptFileType.any}
              isPersonalDriveFileUpload={true}
            />
          </div>
        }
      </div>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}`]
          ) &&
          <div className="col-span-12 lg:col-span-9">
            <ListFiles lastUploadAt={lastUploadAt}/>
          </div>
        }
      </div>
    </BaseLayout>
  );
}

export default WithAuth(PersonalDrive, {
  permissions: Pages.personalDrive.permissions
});