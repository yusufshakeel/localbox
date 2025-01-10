import BaseLayout from '@/layouts/BaseLayout';
import FileUploadComponent from '@/components/FileUploadComponent';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {useState} from 'react';
import {Pages} from '@/configs/pages';
import {useSession} from 'next-auth/react';
import {hasPermissions, isLoggedInSessionForAdmin} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {AcceptFileType} from '@/types/file';
import UserCannotDeleteUploadedFile from '@/components/UserCannotDeleteUploadedFile';
import DeleteFile from '@/components/admins/DeleteFile';

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
            <div className="col-span-12 lg:col-span-5 mb-10">
              <FileUploadComponent
                setLastUploadAt={setLastUploadAt}
                dir={PublicFolders.uploads}
                acceptFileType={AcceptFileType.any}/>
              <UserCannotDeleteUploadedFile session={session}/>
            </div>
        }
      </div>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.uploads.id}:${PermissionsType.AUTHORIZED_VIEW}`]
          ) &&
            <div className="col-span-12 lg:col-span-9 mb-10">
              <ListDirectoryFiles
                dir={PublicFolders.uploads}
                sort={'DESC'}
                deleteFileHandler={
                  isLoggedInSessionForAdmin(session)
                    ? deleteFileHandler
                    : undefined
                }
                lastUploadAt={lastUploadAt}
              />
            </div>
        }
      </div>
      {
        isLoggedInSessionForAdmin(session)
        && <DeleteFile fileToDelete={fileToDelete} setLastUploadAt={setLastUploadAt}/>
      }
    </BaseLayout>
  );
}

export default WithAuth(Uploads, {
  permissions: Pages.uploads.permissions
});
