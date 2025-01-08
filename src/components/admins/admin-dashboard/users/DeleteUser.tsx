import {useEffect, useState} from 'react';
import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {AlertError} from '@/components/alerts';
import {getISOStringDate} from '@/utils/date';

export default function DeleteUser(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (props.userAccountToDelete?.id) {
      setUserId(props.userAccountToDelete.id);
      setUsername(props.userAccountToDelete.username);
      setOpen(true);
    }
  }, [props.userAccountToDelete]);

  async function handleDelete() {
    try {
      setErrorMessage('');
      const response = await httpClient.delete({
        url: '/api/admins/users',
        params: { userId }
      });
      if (response.statusCode === 200) {
        props.setLastUserAccountChangesAt(getISOStringDate());
        setOpen(false);
        props.setUserAccountToDelete('');
        showToast({ content: 'User account deleted', type: 'success', autoClose: 1000 });
      } else {
        setErrorMessage(response.message!);
      }
    } catch (error: any) {
      showToast({ content: error.message, type: 'error' });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Delete user account</DialogTitle>
        </DialogHeader>
        <div>
          { errorMessage && <AlertError message={errorMessage}/> }
          <p>You are about to delete user account: {username}</p>
          <p>This is an irreversible action. Do you wish to proceed?</p>
        </div>
        <DialogFooter>
          <Button variant="destructive" className="me-3" onClick={handleDelete}>Yes, delete the account</Button>
          <Button variant="secondary" className="me-3" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}