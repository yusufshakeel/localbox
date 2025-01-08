import Image from 'next/image';
import BaseLayout from '@/layouts/BaseLayout';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {useState} from 'react';
import {getFilename} from '@/utils/filename';
import {Button} from '@/components/ui/button';
import {handleDownload} from '@/utils/download';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';

function Images() {
  const [selectedFile, setSelectedFile] = useState<string|null>(null);

  const selectedFileHandler = (file: string) => {
    if (file.length) {
      setSelectedFile(file);
    }
  };
  
  return (
    <BaseLayout pageTitle={'Images'}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 mb-10">
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
                  <p className="my-3 text-center">{getFilename(selectedFile).substring(0, 30)}</p>
                  <p className="my-3 text-center">
                    <Button variant="secondary"
                      onClick={() => handleDownload('images', selectedFile)}>
                      Download
                    </Button>
                  </p>
                </div>
              )
              : <div className="aspect-video rounded-xl bg-muted/50"/>
          }
        </div>
        <div className="col-span-12 lg:col-span-7 mb-10">
          <ListDirectoryFiles
            dir={PublicFolders.images}
            selectedFileHandler={selectedFileHandler}
            selectedFileHandlerText='View'
          />
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(Images, {
  permissions: Pages.images.permissions
});
