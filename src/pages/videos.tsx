import {useState} from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import BaseLayout from '@/layouts/BaseLayout';
import {getFilename} from '@/utils/filename';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {useSession} from 'next-auth/react';

function Videos() {
  const {data: session} = useSession() as any;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const selectedFileHandler = (file: string) => {
    if (file.length) {
      setSelectedFile(file);
    }
  };

  return (
    <BaseLayout pageTitle={Pages.videos.title}>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session?.user?.permissions,
            [`${Pages.videos.id}:${PermissionsType.AUTHORIZED_VIEW}`]
          ) && (
            <>
              <div className="col-span-12 lg:col-span-5 mb-10">
                <AspectRatio ratio={16 / 9}>
                  {
                    selectedFile?.length
                      ? (
                        <>
                          <video controls key={selectedFile}
                            autoPlay={true}>
                            <source src={`/videos/${encodeURIComponent(selectedFile)}`}/>
                            Your browser does not support the video tag.
                          </video>
                          <p
                            className="my-3 text-center">{getFilename(selectedFile).substring(0, 30)}</p>
                        </>
                      )
                      : <div className="aspect-video rounded-xl bg-muted/50"/>
                  }
                </AspectRatio>
              </div>
              <div className="col-span-12 lg:col-span-7 mb-10">
                <ListDirectoryFiles
                  dir={PublicFolders.videos}
                  selectedFileHandler={selectedFileHandler}
                  selectedFileHandlerText='Play'
                />
              </div>
            </>
          )
        }
      </div>
    </BaseLayout>
  );
}

export default WithAuth(Videos, {
  permissions: Pages.videos.permissions
});