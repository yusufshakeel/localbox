import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {getFilename} from '@/utils/filename';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {AlertError} from '@/components/alerts';
import {getISOStringDate} from '@/utils/date';
import {Input} from '@/components/ui/input';
import path from 'path';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle} from 'lucide-react';

export default function RenameFile(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [currentFilename, setCurrentFilename] = useState<string>('');
  const [newFilename, setNewFilename] = useState<string>('');

  useEffect(() => {
    if (props.fileToRename?.filename) {
      const filename = getFilename(props.fileToRename.filename);
      setOpen(true);
      setCurrentFilename(filename);
      setNewFilename(filename);
    }
  }, [props.fileToRename, props.isPersonalDriveFileDelete]);

  const closeDialog = () => {
    setErrorMessage('');
    setOpen(false);
  };

  const renameHandler = async () => {
    try {
      setErrorMessage('');

      if (!newFilename.trim().length) {
        setErrorMessage('Please enter a file name');
        return;
      }

      const response = await httpClient.patch({
        url: '/api/files',
        body: {
          isPersonalDriveFileDelete: props.isPersonalDriveFileDelete,
          dir: props.fileToRename?.dir,
          filename: props.fileToRename?.filename,
          newFilename: newFilename.trim()
        },
        params: { action: 'renameFile' }
      });
      if (response.statusCode === 200) {
        closeDialog();
        props.setLastUploadAt(getISOStringDate());
        showToast({ content: 'File renamed successfully', type: 'success', autoClose: 1000 });
      } else if (response.statusCode >= 400 && response.message) {
        showToast({ content: response.message, type: 'error' });
      } else {
        showToast({ content: 'Something went wrong', type: 'error' });
      }
    } catch (error: any) {
      showToast({ content: error.message, type: 'error' });
    }
  };

  const checkFileExtension = () => {
    if (!newFilename.trim().length) {
      return;
    }
    const currentFileExtension = path.extname(props.fileToRename.filename);
    const newFileExtension = path.extname(newFilename);
    if (newFileExtension !== currentFileExtension) {
      return (
        <div className="mt-3">
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>
              <p>
                You have changed the file extension
                from <strong>{currentFileExtension}</strong> to <strong>{newFileExtension}</strong>.
              </p>
              <p>Make sure it is correct before proceeding.</p>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
        </DialogHeader>
        { errorMessage && <AlertError message={errorMessage}/> }
        <Input value={newFilename}
          onChange={e => setNewFilename(e.target.value)}
        />
        <p className="text-sm">{checkFileExtension()}</p>
        <DialogFooter>
          <Button variant="default"
            className="me-3"
            onClick={renameHandler}
            disabled={newFilename.trim() === currentFilename.trim()}
          >
            Yes, rename the file
          </Button>
          <Button variant="secondary" className="me-3" onClick={closeDialog}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}