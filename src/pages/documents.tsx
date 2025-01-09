import BaseLayout from '@/layouts/BaseLayout';
import ListDirectoryFiles from '@/components/ListDirectoryFiles';
import {PublicFolders} from '@/configs/folders';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import {useSession} from 'next-auth/react';

function Documents() {
  const {data: session} = useSession() as any;

  return (
    <BaseLayout pageTitle={Pages.documents.title}>
      <div className="grid grid-cols-12 gap-4">
        {
          hasPermissions(
            session?.user?.permissions,
            [`${Pages.documents.id}:${PermissionsType.AUTHORIZED_VIEW}`]
          ) && (
            <div className="col-span-12">
              <ListDirectoryFiles
                dir={PublicFolders.documents}
              />
            </div>
          )
        }
      </div>
    </BaseLayout>
  );
}

export default WithAuth(Documents, {
  permissions: Pages.documents.permissions
});