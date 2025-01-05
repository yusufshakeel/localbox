import BaseLayout from '@/layouts/BaseLayout';
import FileUploadComponent from '@/components/FileUploadComponent';
import ListDirectoryFiles from '@/components/data-table/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';

function Uploads() {
  return (
    <BaseLayout pageTitle={'Uploads'}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 mb-10">
          <FileUploadComponent/>
        </div>
        <div className="col-span-12 lg:col-span-7 mb-10">
          <ListDirectoryFiles
            dir={PublicFolders.uploads}
            sort={'DESC'}
          />
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(Uploads);
