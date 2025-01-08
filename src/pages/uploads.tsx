import BaseLayout from '@/layouts/BaseLayout';
import FileUploadComponent from '@/components/FileUploadComponent';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {useState} from 'react';
import {Pages} from '@/configs/pages';

function Uploads() {
  const [lastUploadAt, setLastUploadAt] = useState<string>('');

  return (
    <BaseLayout pageTitle={'Uploads'}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 mb-10">
          <FileUploadComponent setLastUploadAt={setLastUploadAt}/>
        </div>
        <div className="col-span-12 lg:col-span-7 mb-10">
          <ListDirectoryFiles
            dir={PublicFolders.uploads}
            sort={'DESC'}
            lastUploadAt={lastUploadAt}
          />
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(Uploads, {
  permissions: Pages.uploads.permissions
});
