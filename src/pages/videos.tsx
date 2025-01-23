import {useEffect, useState} from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import {getFilename} from '@/utils/filename';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {useSession} from 'next-auth/react';
import FileUploadComponent from '@/components/FileUploadComponent';
import {AcceptFileType} from '@/types/file';
import {Video} from 'lucide-react';
import UserCannotDeleteUploadedFile from '@/components/UserCannotDeleteUploadedFile';
import DeleteFile from '@/components/DeleteFile';

function Videos() {
  const {data: session} = useSession() as any;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [lastUploadAt, setLastUploadAt] = useState<string>('');
  const [fileToDelete, setFileToDelete] = useState<{dir: string, filename: string} | null>(null);

  useEffect(() => {
    if (lastUploadAt && selectedFile === fileToDelete?.filename) {
      setSelectedFile('');
    }
  }, [fileToDelete?.filename, lastUploadAt, selectedFile]);

  const selectedFileHandler = (file: string) => {
    if (file.length) {
      setSelectedFile(file);
    }
  };

  const deleteFileHandler = (dir: string, filename: string) => {
    setFileToDelete({dir, filename});
  };

  return (
    <BaseLayout pageTitle={Pages.videos.title}>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.videos.id}:${PermissionsType.AUTHORIZED_USE}`]
          ) &&
            <div className="col-span-12 lg:col-span-5 mb-10">
              <FileUploadComponent
                setLastUploadAt={setLastUploadAt}
                dir={PublicFolders.videos}
                acceptFileType={AcceptFileType.video}/>
              <UserCannotDeleteUploadedFile/>
            </div>
        }
      </div>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.videos.id}:${PermissionsType.AUTHORIZED_VIEW}`]
          ) && (
            <>
              <div className="col-span-12 lg:col-span-5 mb-10">
                {
                  selectedFile?.length
                    ? (
                      <>
                        <video controls key={selectedFile}
                          autoPlay={true}>
                          <source src={`/videos/${encodeURIComponent(selectedFile)}`}/>
                            Your browser does not support the video tag.
                        </video>
                        <p className="my-5 text-center truncate">{getFilename(selectedFile)}</p>
                      </>
                    )
                    : <div className="aspect-video rounded-xl bg-muted/50">
                      <div className="flex items-center justify-center h-64">
                        <Video className="w-12 h-12"/>
                      </div>
                    </div>
                }
              </div>
              <div className="col-span-12 lg:col-span-7 mb-10">
                <ListDirectoryFiles
                  dir={PublicFolders.videos}
                  sort={'DESC'}
                  deleteFileHandler={deleteFileHandler}
                  session={session}
                  selectedFileHandler={selectedFileHandler}
                  selectedFileHandlerText='Play'
                  lastUploadAt={lastUploadAt}
                />
              </div>
            </>
          )
        }
      </div>
      <DeleteFile fileToDelete={fileToDelete} setLastUploadAt={setLastUploadAt}/>
    </BaseLayout>
  );
}

export default WithAuth(Videos, {
  permissions: Pages.videos.permissions
});