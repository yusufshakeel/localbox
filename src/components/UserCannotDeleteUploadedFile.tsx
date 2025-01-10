import {isLoggedInSessionForUser} from '@/utils/permissions';

export default function UserCannotDeleteUploadedFile({session}: { session: any}) {
  return (
    isLoggedInSessionForUser(session)
    && <div className="my-5">
      <p className="text-sm text-muted-foreground">You cannot delete a file that you have uploaded.</p>
      <p className="text-sm text-muted-foreground">Contact Admin to remove a file.</p>
    </div>
  );
}