import { ColumnDef } from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import httpClient from '@/api-clients';
import {FilesApiResponse} from '@/types/api-responses';
import showToast from '@/utils/show-toast';
import {DataTable} from '@/components/data-table/index';
import {getFilename} from '@/utils/filename';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type FileInfo = {
  dir: string
  filename: string
  selectedFileHandler?: (filename: string) => void
  selectedFileHandlerText?: string
}

const columns: ColumnDef<FileInfo>[] = [
  {
    accessorKey: 'filename',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const filename: string = row.getValue('filename');
      return <div className="font-medium">{getFilename(filename)}</div>;
    }
  },
  {
    id: 'actions',
    header: () => <div className="font-bold">Actions</div>,
    cell: ({ row }) => {
      const { dir, filename, selectedFileHandlerText, selectedFileHandler } = row.original;

      const handleDownload = () => {
        const link = document.createElement('a');
        link.href = dir;
        link.download = filename;
        link.click();
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {
              selectedFileHandler && (
                <>
                  <DropdownMenuItem onClick={() => selectedFileHandler(filename)}>
                    {selectedFileHandlerText || 'Action'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )
            }
            <DropdownMenuItem onClick={handleDownload}>
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export type PropType = {
  dir: string,
  sort?: 'ASC' | 'DESC',
  selectedFileHandler?: (filename: string) => void,
  selectedFileHandlerText?: string
}

export default function ListDirectoryFiles(props: PropType) {
  const [files, setFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await httpClient.get<FilesApiResponse>({
        url: '/api/files',
        params: { dir: props.dir, sort: props.sort }
      });
      if (response.statusCode === 200 && response.data!.files) {
        setFiles(response.data!.files.map(filename => {
          return {
            dir: props.dir,
            selectedFileHandler: props.selectedFileHandler,
            selectedFileHandlerText: props.selectedFileHandlerText,
            filename
          };
        }));
      }
    };
    fetchFiles().catch(e => showToast({content: e.message, type: 'error'}));
  }, [props.dir, props.sort]);

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={files}/>
    </div>
  );
}