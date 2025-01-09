import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import BaseLayout from '@/layouts/BaseLayout';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {useSession} from 'next-auth/react';
import {Button} from '@/components/ui/button';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';
import {hasPermissions} from '@/utils/permissions';
import {PermissionsType} from '@/types/permissions';
import UpdatePassword from '@/components/profile/UpdatePassword';
import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import UpdateDetails from '@/components/profile/UpdateDetails';

function ProfilePage() {
  const {data: session} = useSession() as any;
  const [lastUserAccountChangesAt, setLastUserAccountChangesAt] = useState('');
  const [userAccountToUpdate, setUserAccountToUpdate] = useState<any>(null);
  const [userAccountPasswordToUpdate, setUserAccountPasswordToUpdate] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (session.user) {
      (async() => {
        const response: any = await httpClient.get({
          url: '/api/profile',
          params: { userId: session.user.id }
        });
        if (response.statusCode === 200 && response.data) {
          setUserDetails(response.data.user);
        }
      })();
    }
  }, [lastUserAccountChangesAt, session.user]);

  if (!userDetails) {
    return;
  }

  return (
    <BaseLayout pageTitle={Pages.profile.title}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 mb-10">
          <div className="mb-5">
            {
              hasPermissions(
                userDetails.permissions,
                [`${Pages.profile.id}:${PermissionsType.AUTHORIZED_USE}`]
              ) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default">Edit</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => setUserAccountToUpdate(() => userDetails)}>
                      Update Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setUserAccountPasswordToUpdate(() => userDetails)}>
                      Update Password
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }
          </div>

          {
            hasPermissions(
              userDetails.permissions,
              [`${Pages.profile.id}:${PermissionsType.AUTHORIZED_VIEW}`]
            ) && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Key</TableHead>
                    <TableHead className="font-bold">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>{userDetails.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Display Name</TableCell>
                    <TableCell>{userDetails.displayName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Account Status</TableCell>
                    <TableCell>{userDetails.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Account Type</TableCell>
                    <TableCell>{userDetails.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Created At</TableCell>
                    <TableCell>{new Date(userDetails.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Updated At</TableCell>
                    <TableCell>{new Date(userDetails.updatedAt).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Permissions</TableCell>
                    <TableCell>
                      {
                        userDetails.permissions.sort().map((permission: string) => {
                          return <p key={permission}><code>{permission}</code></p>;
                        })
                      }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )
          }
        </div>
      </div>
      <UpdatePassword
        setLastUserAccountChangesAt={setLastUserAccountChangesAt}
        userAccountPasswordToUpdate={userAccountPasswordToUpdate}
        setUserAccountPasswordToUpdate={setUserAccountPasswordToUpdate}/>
      <UpdateDetails
        userAccountToUpdate={userAccountToUpdate}
        setUserAccountToUpdate={setUserAccountToUpdate}
        setLastUserAccountChangesAt={setLastUserAccountChangesAt}/>
    </BaseLayout>
  );
}

export default WithAuth(ProfilePage, {
  permissions: Pages.profile.permissions
});