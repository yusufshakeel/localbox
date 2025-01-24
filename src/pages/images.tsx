import Image from 'next/image';
import BaseLayout from '@/layouts/BaseLayout';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {handleDownload} from '@/utils/download';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {useSession} from 'next-auth/react';
import FileUploadComponent from '@/components/FileUploadComponent';
import {AcceptFileType} from '@/types/file';
import {Image as ImageIcon} from 'lucide-react';
import UserCannotDeleteUploadedFile from '@/components/UserCannotDeleteUploadedFile';
import DeleteFile from '@/components/DeleteFile';
import {getFilename} from '@/utils/filename';

function Images() {
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

  useEffect(() => {
    if (lastUploadAt && selectedFile === fileToDelete?.filename) {
      setSelectedFile('');
    }
  }, [fileToDelete?.filename, lastUploadAt, selectedFile]);
  
  return (
    <BaseLayout pageTitle={Pages.images.title}>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.images.id}:${PermissionsType.AUTHORIZED_USE}`]
          ) &&
            <div className="col-span-12 lg:col-span-5">
              <FileUploadComponent
                setLastUploadAt={setLastUploadAt}
                dir={PublicFolders.images}
                acceptFileType={AcceptFileType.image}/>
              <UserCannotDeleteUploadedFile/>
            </div>
        }
      </div>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session,
            [`${Pages.images.id}:${PermissionsType.AUTHORIZED_VIEW}`]
          ) && (
            <>
              <div className="col-span-12 lg:col-span-5">
                {
                  selectedFile?.length
                    ? (
                      <div>
                        <Image
                          width={300}
                          height={300}
                          className="img-fluid ms-auto me-auto"
                          src={`/images/${encodeURIComponent(selectedFile)}`}
                          alt={selectedFile}/>
                        <p className="my-5 text-center">{getFilename(selectedFile)}</p>
                        <p className="my-3 text-center">
                          <Button variant="secondary"
                            onClick={() => handleDownload('images', selectedFile)}>
                            Download
                          </Button>
                        </p>
                      </div>
                    )
                    : <div className="aspect-video rounded-xl bg-muted/50">
                      <div className="flex items-center justify-center h-64">
                        <ImageIcon className="w-12 h-12"/>
                      </div>
                    </div>
                }
              </div>
              <div className="col-span-12 lg:col-span-7">
                <ListDirectoryFiles
                  dir={PublicFolders.images}
                  sort={'DESC'}
                  deleteFileHandler={deleteFileHandler}
                  session={session}
                  selectedFileHandler={selectedFileHandler}
                  selectedFileHandlerText="View"
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

export default WithAuth(Images, {
  permissions: Pages.images.permissions
});
