import { ColumnDef } from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import { ArrowUpDown } from 'lucide-react';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {DataTable} from '@/components/data-table';
import {Button} from '@/components/ui/button';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type PageSchemaForColumn = {
  id: string
  link: string
  title: string
  type: string
  status: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

const columns: ColumnDef<PageSchemaForColumn>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Title</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'link',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Link</span>
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
      return permissions.map(v => {
        return (
          <span className="bg-gray-200 text-black py-1 px-3 m-1 rounded" key={v}>{v}</span>
        );
      });
    }
  }
];

export default function ListPages() {
  const [pages, setPages] = useState<PageSchemaForColumn[]>([]);

  useEffect(() => {
    const apiCall = async () => {
      const response: any = await httpClient.get({
        url: '/api/admins/pages'
      });
      if (response.statusCode === 200 && response.data?.pages) {
        setPages(response.data.pages);
      }
    };
    apiCall().catch(e => showToast({content: e.message, type: 'error'}));
  }, []);

  return (
    <DataTable columns={columns} data={pages} columnToSearch='title'/>
  );
}