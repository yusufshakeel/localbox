import {useState} from 'react';
import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import showToast from '@/utils/show-toast';

export type PropType = {
  deleteAccount: () => void;
};

export default function DeleteAccountModalComponent(props: PropType) {
  const getCode = () => (Math.random()).toString().substring(2, 8);

  const [open, setOpen] = useState(false);
  const [deleteAccountText, setDeleteAccountText] = useState(getCode());
  const [confirmDeleteAccountText, setConfirmDeleteAccountText] = useState('');

  const deleteHandler = async () => {
    props.deleteAccount();
    setOpen(false);
    showToast({content: 'Account Deleted!', type: 'success', autoClose: 1000});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" onClick={() => setDeleteAccountText(getCode())}>Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account?</DialogTitle>
        </DialogHeader>
        <div>
          <p className="mb-3">You are about to delete your account. This is an irreversible
            action.</p>
          <p className="mb-3">Type <strong>{deleteAccountText}</strong> to continue.</p>
          <Input className="mb-3" maxLength={deleteAccountText.length}
            onChange={(e) => setConfirmDeleteAccountText(e.target.value)}/>
        </div>
        <DialogFooter>
          <Button variant="destructive"
            onClick={deleteHandler}
            disabled={confirmDeleteAccountText !== deleteAccountText}>
            Yes, delete my account.
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}