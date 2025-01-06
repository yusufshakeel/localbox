import { ColumnDef } from '@tanstack/react-table';
import {useCallback, useEffect, useState} from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {DataTable} from '@/components/data-table';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  deleteUser: (_: string) => Promise<void>
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
    id: 'actions',
    header: () => <div className="font-bold">Actions</div>,
    cell: ({ row }) => {
      const { id, username, displayName, deleteUser, setUserAccountToUpdate } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setUserAccountToUpdate({id, username, displayName})}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => await deleteUser(id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export default function ListUsers(props: any) {
  const [files, setFiles] = useState<UserSchemaForColumn[]>([]);

  const deleteUser = useCallback(async (userId: string) => {
    const response: any = await httpClient.delete({
      url: '/api/admins/users',
      params: { userId }
    });
    if (response.statusCode === 200) {
      showToast({ content: 'User deleted', type: 'success', autoClose: 1000 });
      props.setLastUserAccountChangesAt(new Date().toISOString());
    } else {
      showToast({ content: 'Something went wrong', type: 'error', autoClose: 1000 });
    }
  }, [props]);

  const fetchUsers = useCallback(async () => {
    const response: any = await httpClient.get({
      url: '/api/admins/users'
    });
    if (response.statusCode === 200 && response.data?.users) {
      setFiles(response.data.users.map((user: any) => {
        return {
          ...user,
          deleteUser,
          setUserAccountToUpdate: props.setUserAccountToUpdate
        };
      }));
    }
  }, [deleteUser, props.setUserAccountToUpdate]);

  useEffect(() => {
    fetchUsers().catch(e => showToast({content: e.message, type: 'error'}));
  }, [fetchUsers, props.lastUserAccountCreatedAt]);

  return (
    <DataTable columns={columns} data={files} columnToSearch='username'/>
  );
}