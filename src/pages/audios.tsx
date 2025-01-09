import BaseLayout from '@/layouts/BaseLayout';
import {useState} from 'react';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {getFilename} from '@/utils/filename';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';

function Audios() {
  const [selectedFile, setSelectedFile] = useState<string|null>(null);

  const selectedFileHandler = (file: string) => {
    if (file.length) {
      setSelectedFile(file);
    }
  };
  
  return (
    <BaseLayout pageTitle={Pages.audios.title}>
      <div className="grid grid-cols-12 gap-4">
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
                  <p
                    className="my-5 text-center truncate">{getFilename(selectedFile).substring(0, 30)}</p>
                </div>
              )
              : <div className="aspect-video rounded-xl bg-muted/50"/>
          }
        </div>
        <div className="col-span-12 lg:col-span-7 mb-10">
          <ListDirectoryFiles
            dir={PublicFolders.audios}
            selectedFileHandler={selectedFileHandler}
            selectedFileHandlerText='Play'
          />
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(Audios, {
  permissions: Pages.audios.permissions
});
