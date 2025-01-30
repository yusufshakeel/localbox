import { ColumnDef } from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import {ArrowUpDown, HardDrive, MoreHorizontal} from 'lucide-react';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {DataTable} from '@/components/data-table';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {formatDate} from '@/utils/date';
import {humanReadableFileSize} from '@/utils/filesize';
import {Progress} from '@/components/ui/progress';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type UserSchemaForColumn = {
  id: string
  username: string
  displayName: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
  permissions: string[],
  personalDriveStorageLimit: number,
  personalDriveStorageUsed: number,
  setUserAccountToDelete: (_: object) => void
  setUserAccountPasswordToUpdate: (_: object) => void
  setUserAccountPermissionsToUpdate: (_: object) => void
  setUserAccountToUpdate: (_: object) => void
}

const columns: ColumnDef<UserSchemaForColumn>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Username</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'displayName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Display Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Account Status'
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Updated At</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const { permissions } = row.original;
      return permissions.length;
    }
  },
  {
    accessorKey: 'personalDriveStorageUsed',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Personal Drive</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const {
        personalDriveStorageLimit,
        personalDriveStorageUsed
      } = row.original;

      if (personalDriveStorageLimit && +personalDriveStorageLimit >= 0) {
        return (
          <span>
            {humanReadableFileSize(+personalDriveStorageUsed || 0)} of {' '}
            {humanReadableFileSize(+personalDriveStorageLimit)}
          </span>
        );
      }
      return 'Not Configured';
    }
  },
  {
    id: 'actions',
    header: () => <div className="font-bold">Actions</div>,
    cell: ({ row }) => {
      const {
        id,
        username,
        displayName,
        permissions,
        status,
        personalDriveStorageLimit,
        personalDriveStorageUsed,
        setUserAccountToDelete,
        setUserAccountPasswordToUpdate,
        setUserAccountPermissionsToUpdate,
        setUserAccountToUpdate
      } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setUserAccountPasswordToUpdate({id, username, displayName})}
            >
              Update Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setUserAccountToUpdate(
                {
                  id,
                  username,
                  displayName,
                  status,
                  personalDriveStorageLimit,
                  personalDriveStorageUsed,
                  permissions
                }
              )}>
              Update Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setUserAccountPermissionsToUpdate({
                id, username, displayName, permissions
              })}
            >
              Update Permissions
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className="text-red-500"
              onClick={() => setUserAccountToDelete({id, username, displayName})}
            >
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export default function ListUsers(props: any) {
  const [files, setFiles] = useState<UserSchemaForColumn[]>([]);
  const [storageLimit, setStorageLimit] = useState<number | null>(null);
  const [storageUsed, setStorageUsed] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response: any = await httpClient.get({
        url: '/api/admins/users'
      });
      if (response.statusCode === 200 && response.data?.users) {
        let limit = 0;
        let used = 0;
        setFiles(response.data.users.map((user: any) => {
          limit += +user.personalDriveStorageLimit || 0;
          used += +user.personalDriveStorageUsed || 0;
          return {
            ...user,
            updatedAt: user.updatedAt ? formatDate(user.updatedAt) : '',
            setUserAccountToDelete: props.setUserAccountToDelete,
            setUserAccountPasswordToUpdate: props.setUserAccountPasswordToUpdate,
            setUserAccountPermissionsToUpdate: props.setUserAccountPermissionsToUpdate,
            setUserAccountToUpdate: props.setUserAccountToUpdate
          };
        }));
        setStorageLimit(limit);
        setStorageUsed(used);
      }
    };
    fetchUsers().catch(e => showToast({content: e.message, type: 'error'}));
  }, [
    props.lastUserAccountChangesAt,
    props.setUserAccountPasswordToUpdate,
    props.setUserAccountPermissionsToUpdate,
    props.setUserAccountToDelete,
    props.setUserAccountToUpdate
  ]);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 my-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-muted/50">
            <div className="flex items-center p-4">
              <HardDrive className="w-10 h-10 mr-4" />
              <div>
                <p className="text-lg font-medium">Personal Drive</p>
                {
                  storageUsed !== null && storageLimit !== null
                  && (
                    <p>
                      {humanReadableFileSize(storageUsed)} used out
                      of {humanReadableFileSize(storageLimit)}
                    </p>
                  )
                }
                {
                  storageUsed !== null && storageUsed >= 0
                  && storageLimit !== null && storageLimit > 0
                  && (
                    <div className="my-2">
                      <Progress value={Math.floor((storageUsed/storageLimit) * 100)} />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={files}/>
    </>
  );
}