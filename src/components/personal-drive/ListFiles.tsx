import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {DataTable} from '@/components/data-table';
import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {ArrowUpDown, MoreHorizontal} from 'lucide-react';
import {getFilename} from '@/utils/filename';
import {humanReadableFileSize} from '@/utils/filesize';
import {formatDate} from '@/utils/date';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {handlePersonalDriveDownload} from '@/utils/download';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type FilesSchemaForColumn = {
  filename: string,
  displayFileName: string,
  sizeHumanReadable: string,
  uploadedAt: string,
}

const columns: ColumnDef<FilesSchemaForColumn>[] = [
  {
    accessorKey: 'displayFileName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Filename</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'sizeHumanReadable',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Size</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'uploadedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="font-bold">Uploaded At</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    id: 'actions',
    header: () => <div className="font-bold">Actions</div>,
    cell: ({ row }) => {
      const {
        filename
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
            <DropdownMenuItem onClick={() => handlePersonalDriveDownload(filename)}>
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export default function ListFiles(props: any) {
  const [files, setFiles] = useState<FilesSchemaForColumn[]>([]);

  useEffect(() => {
    const apiCall = async () => {
      const response: any = await httpClient.get({
        url: '/api/personal-drive'
      });
      if (response.statusCode === 200 && response.data?.files) {
        setFiles(response.data.files.map((file: any) => {
          return {
            filename: file.filename,
            displayFileName: getFilename(file.filename),
            sizeHumanReadable: humanReadableFileSize(file.details.size),
            uploadedAt: formatDate(file.details.birthtime)
          };
        }));
      }
    };
    apiCall().catch(e => showToast({content: e.message, type: 'error'}));
  }, [props.lastUploadAt]);

  return (
    <DataTable columns={columns} data={files}/>
  );
}