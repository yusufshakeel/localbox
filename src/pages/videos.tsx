import {useState} from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import BaseLayout from '@/layouts/BaseLayout';
import {getFilename} from '@/utils/filename';
import ListDirectoryFiles from '@/components/data-table/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';

export default function Videos() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const selectedFileHandler = (file: string) => {
    if (file.length) {
      setSelectedFile(file);
    }
  };

  return (
    <BaseLayout pageTitle={'Videos'}>
      <div className="grid grid-cols-12 gap-4">
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
                    <p className="my-3 text-center">{getFilename(selectedFile).substring(0, 30)}</p>
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
      </div>
    </BaseLayout>
  );
}