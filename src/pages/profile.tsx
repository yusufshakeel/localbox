import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import BaseLayout from '@/layouts/BaseLayout';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {useSession} from 'next-auth/react';
import {Button} from '@/components/ui/button';
import {WithAuth} from '@/components/with-auth';

function ProfilePage() {
  const {data: session} = useSession() as any;

  const { user } = session;

  return (
    <BaseLayout pageTitle={'Profile'}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 mb-10">
          <div className="mb-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">Edit</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Username: {user.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
                    user.permissions.sort().map((permission: string) => {
                      return <p key={permission}><code>{permission}</code></p>;
                    })
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(ProfilePage);