import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {DataTable} from '@/components/data-table';
import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {ArrowUpDown, MoreHorizontal} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type ConfigsSchemaForColumn = {
  id: string
  key: string
  value: string,
  setConfigToUpdate: (_: object) => void
}

const columns: ColumnDef<ConfigsSchemaForColumn>[] = [
  {
    accessorKey: 'key',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Key</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'value',
    header: 'Value'
  },
  {
    id: 'actions',
    header: () => <div className="font-bold">Actions</div>,
    cell: ({ row }) => {
      const {
        id,
        key,
        value,
        setConfigToUpdate
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
            <DropdownMenuItem onClick={() => setConfigToUpdate({ id, key, value })}>
              Update Value
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export default function ListConfigs(props: any) {
  const [configs, setConfigs] = useState<ConfigsSchemaForColumn[]>([]);

  useEffect(() => {
    const apiCall = async () => {
      const response: any = await httpClient.get({
        url: '/api/admins/configs'
      });
      if (response.statusCode === 200 && response.data?.configs) {
        setConfigs(response.data.configs.map((setting: any) => {
          return {
            ...setting,
            setConfigToUpdate: props.setConfigToUpdate
          };
        }));
      }
    };
    apiCall().catch(e => showToast({content: e.message, type: 'error'}));
  }, [props.setConfigToUpdate, props.lastConfigChangesAt]);

  return (
    <DataTable columns={columns} data={configs}/>
  );
}