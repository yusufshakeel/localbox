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
import {AcceptFileType} from '@/types/file';
import UserCannotDeleteUploadedFile from '@/components/UserCannotDeleteUploadedFile';
import DeleteFile from '@/components/DeleteFile';

function Uploads() {
  const {data: session} = useSession() as any;
  const [lastUploadAt, setLastUploadAt] = useState<string>('');
  const [fileToDelete, setFileToDelete] = useState<{dir: string, filename: string} | null>(null);

  const deleteFileHandler = (dir: string, filename: string) => {
    setFileToDelete({dir, filename});
  };

  return (
    <BaseLayout pageTitle={Pages.uploads.title}>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.uploads.id}:${PermissionsType.AUTHORIZED_USE}`]
          ) &&
            <div className="col-span-12 lg:col-span-5">
              <FileUploadComponent
                setLastUploadAt={setLastUploadAt}
                dir={PublicFolders.uploads}
                acceptFileType={AcceptFileType.any}/>
              <UserCannotDeleteUploadedFile/>
            </div>
        }
      </div>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.uploads.id}:${PermissionsType.AUTHORIZED_VIEW}`]
          ) &&
            <div className="col-span-12 lg:col-span-9">
              <ListDirectoryFiles
                dir={PublicFolders.uploads}
                sort={'DESC'}
                deleteFileHandler={deleteFileHandler}
                session={session}
                lastUploadAt={lastUploadAt}
              />
            </div>
        }
      </div>
      <DeleteFile fileToDelete={fileToDelete} setLastUploadAt={setLastUploadAt}/>
    </BaseLayout>
  );
}

export default WithAuth(Uploads, {
  permissions: Pages.uploads.permissions
});
