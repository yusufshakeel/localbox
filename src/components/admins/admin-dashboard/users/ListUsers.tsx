import { ColumnDef } from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
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
  permissions: string[]
  setUserAccountToDelete: (_: object) => void
  setUserAccountPasswordToUpdate: (_: object) => void
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
    accessorKey: 'status',
    header: 'Account Status'
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const { updatedAt } = row.original;
      return updatedAt ? new Date(updatedAt).toLocaleString(): '';
    }
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const { permissions } = row.original;
      return permissions.map(v => {
        return (
          <span className="bg-gray-200 text-black py-1 px-3 m-1 rounded" key={v}>{v}</span>
        );
      });
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
        status,
        setUserAccountToDelete,
        setUserAccountPasswordToUpdate,
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
              onClick={() => setUserAccountToUpdate({id, username, displayName, status})}>
              Update Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setUserAccountPasswordToUpdate({id, username, displayName})}
            >
              Update Password
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

  useEffect(() => {
    const fetchUsers = async () => {
      const response: any = await httpClient.get({
        url: '/api/admins/users'
      });
      if (response.statusCode === 200 && response.data?.users) {
        setFiles(response.data.users.map((user: any) => {
          return {
            ...user,
            setUserAccountToDelete: props.setUserAccountToDelete,
            setUserAccountPasswordToUpdate: props.setUserAccountPasswordToUpdate,
            setUserAccountToUpdate: props.setUserAccountToUpdate
          };
        }));
      }
    };
    fetchUsers().catch(e => showToast({content: e.message, type: 'error'}));
  }, [
    props.lastUserAccountChangesAt,
    props.setUserAccountPasswordToUpdate,
    props.setUserAccountToDelete,
    props.setUserAccountToUpdate
  ]);

  return (
    <DataTable columns={columns} data={files} columnToSearch='username'/>
  );
}