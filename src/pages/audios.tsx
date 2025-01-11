import BaseLayout from '@/layouts/BaseLayout';
import {useState} from 'react';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {getFilename} from '@/utils/filename';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';
import {
  hasPermissions,
  isLoggedInSessionForAdmin
} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {useSession} from 'next-auth/react';
import FileUploadComponent from '@/components/FileUploadComponent';
import {AcceptFileType} from '@/types/file';
import {Music} from 'lucide-react';
import DeleteFile from '@/components/admins/DeleteFile';
import UserCannotDeleteUploadedFile from '@/components/UserCannotDeleteUploadedFile';

function Audios() {
  const {data: session} = useSession() as any;
  const [selectedFile, setSelectedFile] = useState<string|null>(null);
  const [lastUploadAt, setLastUploadAt] = useState<string>('');
  const [fileToDelete, setFileToDelete] = useState<{dir: string, filename: string} | null>(null);

  const selectedFileHandler = (file: string) => {
    if (file.length) {
      setSelectedFile(file);
    }
  };

  const deleteFileHandler = (dir: string, filename: string) => {
    setFileToDelete({dir, filename});
  };
  
  return (
    <BaseLayout pageTitle={Pages.audios.title}>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.audios.id}:${PermissionsType.AUTHORIZED_USE}`]
          ) &&
            <div className="col-span-12 lg:col-span-5 mb-10">
              <FileUploadComponent
                setLastUploadAt={setLastUploadAt}
                dir={PublicFolders.audios}
                acceptFileType={AcceptFileType.audio}/>
              <UserCannotDeleteUploadedFile/>
            </div>
        }
      </div>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.audios.id}:${PermissionsType.AUTHORIZED_VIEW}`]
          ) && (
            <>
              <div className="col-span-12 lg:col-span-5 mb-10">
                {
                  selectedFile?.length
                    ? (
                      <div className="mb-5">
                        <audio style={{width: '100%'}} controls key={selectedFile}
                          autoPlay={true}>
                          <source src={`/audios/${encodeURIComponent(selectedFile)}`}/>
                          Your browser does not support the audio tag.
                        </audio>
                        <p className="my-5 text-center truncate">{getFilename(selectedFile)}</p>
                      </div>
                    )
                    : <div className="aspect-video rounded-xl bg-muted/50">
                      <div className="flex items-center justify-center h-64">
                        <Music className="w-12 h-12"/>
                      </div>
                    </div>
                }
              </div>
              <div className="col-span-12 lg:col-span-7 mb-10">
                <ListDirectoryFiles
                  dir={PublicFolders.audios}
                  sort={'DESC'}
                  deleteFileHandler={
                    isLoggedInSessionForAdmin(session)
                      ? deleteFileHandler
                      : undefined
                  }
                  selectedFileHandler={selectedFileHandler}
                  selectedFileHandlerText="Play"
                  lastUploadAt={lastUploadAt}
                />
              </div>
            </>
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

export default WithAuth(Audios, {
  permissions: Pages.audios.permissions
});
