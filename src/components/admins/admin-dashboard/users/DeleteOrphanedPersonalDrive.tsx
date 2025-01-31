import {Button} from '@/components/ui/button';
import {Wrench} from 'lucide-react';
import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {AlertError} from '@/components/alerts';
import {useEffect, useState} from 'react';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';

export default function DeleteOrphanedPersonalDrive(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [directoriesToDelete, setDirectoriesToDelete] = useState<string[]>([]);

  useEffect(() => {
    const apiCaller = async () => {
      const response: any = await httpClient.get({
        url: '/api/admins/personal-drive',
        params: { action: 'orphanedPersonalDriveDirectories' }
      });
      if (response.statusCode === 200 && response.data?.directories) {
        setDirectoriesToDelete(response.data.directories);
      }
    };
    apiCaller().catch(() => {
      // eslint-disable-next-line
      console.log('Unable to fetch Personal Drive cleanup directories');
    });
  }, [props.lastUserAccountChangesAt]);

  const deleteDirectoriesHandler = async () => {
    try {
      const response: any = await httpClient.delete({
        url: '/api/admins/personal-drive',
        body: { directories: directoriesToDelete },
        params: { action: 'orphanedPersonalDriveDirectories' }
      });
      if (response.statusCode === 200) {
        showToast({ content: 'Cleanup done successfully', type: 'success', autoClose: 1000 });
        closeDialog();
        setDirectoriesToDelete([]);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const closeDialog = () => {
    setErrorMessage('');
    setOpen(false);
  };

  if (directoriesToDelete.length === 0) {
    return;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="ml-3">
          <Wrench />
          Personal Drive - Clean up
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Personal Drive - Clean up</DialogTitle>
        </DialogHeader>
        <div>
          { errorMessage && <AlertError message={errorMessage}/> }
          <p>You previously deleted some user accounts that had access to Personal Drive.
            This action will permanently remove those Personal Drives along with all
            their contents.
          </p>
          <p className="my-5">Total number of Personal Drives to be deleted: {directoriesToDelete.length}</p>
        </div>
        <DialogFooter>
          <Button variant="destructive" className="me-3" onClick={deleteDirectoriesHandler}>Yes, delete the directories</Button>
          <Button variant="secondary" className="me-3" onClick={closeDialog}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}