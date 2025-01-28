import BaseLayout from '@/layouts/BaseLayout';
import {Pages} from '@/configs/pages';
import {WithAuth} from '@/components/with-auth';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {useSession} from 'next-auth/react';
import ListFiles from '@/components/personal-drive/ListFiles';
import FileUploadComponent from '@/components/FileUploadComponent';
import {AcceptFileType} from '@/types/file';
import {useEffect, useState} from 'react';
import DeleteFile from '@/components/DeleteFile';
import httpClient from '@/api-clients';

function PersonalDrive() {
  const {data: session} = useSession() as any;
  const [lastUploadAt, setLastUploadAt] = useState<string>('');
  const [fileToDelete, setFileToDelete] = useState<{filename: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPersonalDriveConfigured, setIsPersonalDriveConfigured] = useState(false);

  useEffect(() => {
    if (loading) {
      (async () => {
        try {
          const response = await httpClient.get({
            url: '/api/personal-drive'
          });
          if (response.statusCode === 200) {
            setIsPersonalDriveConfigured(true);
          } else {
            setIsPersonalDriveConfigured(false);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: any) {
          setIsPersonalDriveConfigured(false);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [loading]);

  const deleteFileHandler = (filename: string) => {
    setFileToDelete({filename});
  };

  if (loading) {
    return (
      <BaseLayout pageTitle={Pages.personalDrive.title}>
        <></>
      </BaseLayout>
    );
  }

  if (!isPersonalDriveConfigured) {
    return (
      <BaseLayout pageTitle={Pages.personalDrive.title}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <h1>Your Personal Drive is not configured. Contact the Admin.</h1>
          </div>
        </div>
      </BaseLayout>
    );
  }

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
          <div className="col-span-12">
            <ListFiles
              lastUploadAt={lastUploadAt}
              deleteFileHandler={deleteFileHandler}
              session={session}
            />
          </div>
        }
      </div>
      <DeleteFile
        fileToDelete={fileToDelete}
        setLastUploadAt={setLastUploadAt}
        isPersonalDriveFileDelete={true}
      />
    </BaseLayout>
  );
}

export default WithAuth(PersonalDrive, {
  permissions: Pages.personalDrive.permissions
});