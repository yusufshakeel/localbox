import BaseLayout from '@/layouts/BaseLayout';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';

function Documents() {
  return (
    <BaseLayout pageTitle={'Documents'}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ListDirectoryFiles
            dir={PublicFolders.documents}
          />
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(Documents, {
  permissions: Pages.documents.permissions
});