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

export default function DeleteFile(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (props.fileToDelete?.dir && props.fileToDelete?.filename) {
      setOpen(true);
    }
  }, [props.fileToDelete]);

  const closeDialog = () => {
    setErrorMessage('');
    setOpen(false);
  };

  const deleteHandler = async () => {
    try {
      setErrorMessage('');
      const response = await httpClient.delete({
        url: '/api/admins/files',
        body: { dir: props.fileToDelete?.dir, filename: props.fileToDelete?.filename }
      });
      if (response.statusCode === 200) {
        closeDialog();
        props.setLastUploadAt(getISOStringDate());
        showToast({ content: 'File deleted successfully', type: 'success', autoClose: 1000 });
      }
    } catch (error: any) {
      showToast({ content: error.message, type: 'error' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
        </DialogHeader>
        { errorMessage && <AlertError message={errorMessage}/> }
        <p>You are about to delete the file. This is an irreversible action.</p>
        <p><strong>{getFilename(props.fileToDelete?.filename)}</strong></p>
        <DialogFooter>
          <Button variant="destructive" className="me-3" onClick={deleteHandler}>Yes, delete the file</Button>
          <Button variant="secondary" className="me-3" onClick={closeDialog}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}