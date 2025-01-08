import BaseLayout from '@/layouts/BaseLayout';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {useSession} from 'next-auth/react';
import {Button} from '@/components/ui/button';
import {handleSignOut} from '@/services/auth-service';
import {WithAuth} from '@/components/with-auth';
import {Pages} from '@/configs/pages';

function ProfilePage() {
  const {data: session} = useSession() as any;

  const { user } = session;

  return (
    <BaseLayout pageTitle={'Profile'}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 mb-10">
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
                <TableCell>{user.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Display Name</TableCell>
                <TableCell>{user.displayName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account Status</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account Type</TableCell>
                <TableCell>{user.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Permissions</TableCell>
                <TableCell>
                  {
                    user.permissions.map((permission: string) => {
                      return <p key={permission}><code>{permission}</code></p>;
                    })
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="my-10">
            <Button onClick={handleSignOut} variant="secondary">Log out</Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(ProfilePage, {
  pageId: Pages.profile.id
});