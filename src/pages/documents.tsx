import BaseLayout from '@/layouts/BaseLayout';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';
import {hasPermissions, isLoggedInSessionForAdmin} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {useSession} from 'next-auth/react';
import FileUploadComponent from '@/components/FileUploadComponent';
import {AcceptFileType} from '@/types/file';
import {useState} from 'react';
import UserCannotDeleteUploadedFile from '@/components/UserCannotDeleteUploadedFile';
import DeleteFile from '@/components/admins/DeleteFile';

function Documents() {
  const {data: session} = useSession() as any;
  const [lastUploadAt, setLastUploadAt] = useState<string>('');
  const [fileToDelete, setFileToDelete] = useState<{dir: string, filename: string} | null>(null);

  const deleteFileHandler = (dir: string, filename: string) => {
    setFileToDelete({dir, filename});
  };

  return (
    <BaseLayout pageTitle={Pages.documents.title}>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.documents.id}:${PermissionsType.AUTHORIZED_USE}`]
          ) &&
            <div className="col-span-12 lg:col-span-5 mb-10">
              <FileUploadComponent
                setLastUploadAt={setLastUploadAt}
                dir={PublicFolders.documents}
                acceptFileType={AcceptFileType.document}/>
              <UserCannotDeleteUploadedFile session={session}/>
            </div>
        }
      </div>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.documents.id}:${PermissionsType.AUTHORIZED_VIEW}`]
          ) && (
            <div className="col-span-12 lg:col-span-9 mb-10">
              <ListDirectoryFiles
                dir={PublicFolders.documents}
                sort={'DESC'}
                deleteFileHandler={
                  isLoggedInSessionForAdmin(session)
                    ? deleteFileHandler
                    : undefined
                }
                lastUploadAt={lastUploadAt}
              />
            </div>
          )
        }
      </div>
      {
        isLoggedInSessionForAdmin(session)
        && <DeleteFile fileToDelete={fileToDelete} setLastUploadAt={setLastUploadAt}/>
      }
    </BaseLayout>
  );
}

export default WithAuth(Documents, {
  permissions: Pages.documents.permissions
});