import BaseLayout from '@/layouts/BaseLayout';
import {useState} from 'react';
import ListDirectoryFiles from '@/components/data-table/ListDirectoryFiles';
import {getFilename} from '@/utils/filename';

export default function Audios() {
  const [selectedFile, setSelectedFile] = useState<string|null>(null);

  const selectedFileHandler = (file: string) => {
    if (file.length) {
      setSelectedFile(file);
    }
  };
  
  return (
    <BaseLayout pageTitle={'Audios'}>
      {
        selectedFile?.length
          ? (
            <div className="mb-5">
              <audio style={{width: '100%'}} controls key={selectedFile}
                autoPlay={true}>
                <source src={`/audios/${encodeURIComponent(selectedFile)}`}/>
                Your browser does not support the audio tag.
              </audio>
              <p className="my-5 text-center truncate">{getFilename(selectedFile).substring(0, 30)}</p>
            </div>
          )
          : <audio className="mb-5" style={{width: '100%'}} controls key={selectedFile}>
            <source src={''}/>
            Your browser does not support the audio tag.
          </audio>
      }
      <ListDirectoryFiles
        dir='audios'
        selectedFileHandler={selectedFileHandler}
        selectedFileHandlerText='Play'
      />
    </BaseLayout>
  );
}
