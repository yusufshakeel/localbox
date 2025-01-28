import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {DataTable} from '@/components/data-table';
import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {AlertCircle, ArrowUpDown, HardDrive, MoreHorizontal} from 'lucide-react';
import {getFilename} from '@/utils/filename';
import {humanReadableFileSize} from '@/utils/filesize';
import {formatDate} from '@/utils/date';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {handlePersonalDriveDownload} from '@/utils/download';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Progress} from '@/components/ui/progress';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type FilesSchemaForColumn = {
  filename: string,
  fileType: string,
  displayFilename: string,
  size: number,
  uploadedAt: string,
  session: any,
  deleteFileHandler?: (filename: string) => void
}

const columns: ColumnDef<FilesSchemaForColumn>[] = [
  {
    accessorKey: 'displayFilename',
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
    accessorKey: 'size',
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
    },
    cell: ({ row }) => {
      return humanReadableFileSize(row.original.size);
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
        filename,
        deleteFileHandler
      } = row.original;

      const getDeleteFileMenuItem = () => {
        if (!deleteFileHandler) {
          return;
        }

        return (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500"
              onClick={() => deleteFileHandler(filename)}>
              Delete
            </DropdownMenuItem>
          </>
        );
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
            <DropdownMenuItem onClick={() => handlePersonalDriveDownload(filename)}>
              Download
            </DropdownMenuItem>
            {getDeleteFileMenuItem()}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export default function ListFiles(props: any) {
  const [files, setFiles] = useState<FilesSchemaForColumn[]>([]);
  const [storageLimit, setStorageLimit] = useState<number | null>(null);
  const [storageUsed, setStorageUsed] = useState<number | null>(null);

  useEffect(() => {
    const apiCall = async () => {
      const response: any = await httpClient.get({
        url: '/api/personal-drive',
        params: { fetchFiles: true, sort: props.sort || 'DESC' }
      });
      if (response.statusCode === 200 && response.data?.files) {
        setStorageLimit(response.data.storageLimit);
        setStorageUsed(response.data.totalSize);
        setFiles(response.data.files.map((file: any) => {
          return {
            filename: file.filename,
            fileType: file.fileType,
            displayFilename: getFilename(file.filename),
            size: file.details.size,
            uploadedAt: formatDate(file.details.birthtime),
            session: props.session,
            deleteFileHandler: props.deleteFileHandler
          };
        }));
      }
    };
    apiCall().catch(e => showToast({content: e.message, type: 'error'}));
  }, [props.deleteFileHandler, props.lastUploadAt, props.session, props.sort]);

  const filterFiles = (files: any[], fileType: string) => {
    return files.filter((file: any) => file.fileType === fileType);
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 my-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-muted/50">
            <div className="flex items-center p-4">
              <HardDrive className="w-10 h-10 mr-4" />
              <div>
                <p className="text-lg font-medium">Storage</p>
                {
                  storageUsed !== null && storageLimit !== null
                    && (
                      <p>
                        {humanReadableFileSize(storageUsed)} used out of {' '}
                        {storageLimit > 0 ? humanReadableFileSize(storageLimit) : 'Unlimited'}
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
      {
        storageUsed !== null && storageUsed > 0 && storageLimit !== null && storageLimit > 0
        && ((storageUsed/storageLimit) > 0.9) && (
          <div className="my-5">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>
                <p>You have used {Math.floor((storageUsed/storageLimit) * 100)}% of
                  your storage space.</p>
                <p>Delete files to free up space, or reach out to the Admin to
                  upgrade your storage.</p>
              </AlertDescription>
            </Alert>
          </div>
        )
      }
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="audios">Audios</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="mt-5">
            <DataTable columns={columns} data={files}/>
          </div>
        </TabsContent>
        <TabsContent value="images">
          <div className="mt-5">
            <DataTable columns={columns} data={filterFiles(files, 'image')}/>
          </div>
        </TabsContent>
        <TabsContent value="videos">
          <div className="mt-5">
            <DataTable columns={columns} data={filterFiles(files, 'video')}/>
          </div>
        </TabsContent>
        <TabsContent value="audios">
          <div className="mt-5">
            <DataTable columns={columns} data={filterFiles(files, 'audio')}/>
          </div>
        </TabsContent>
        <TabsContent value="documents">
          <div className="mt-5">
            <DataTable columns={columns} data={filterFiles(files, 'document')}/>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}