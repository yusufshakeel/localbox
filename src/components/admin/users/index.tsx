import {useState} from 'react';
import ListUsers from '@/components/admin/users/ListUsers';
import CreateUser from '@/components/admin/users/CreateUser';
import UpdateUser from '@/components/admin/users/UpdateUser';
import DeleteUser from '@/components/admin/users/DeleteUser';
import UpdateUserPassword from '@/components/admin/users/UpdateUserPassword';

export default function UserManagementComponent() {
  const [lastUserAccountChangesAt, setLastUserAccountChangesAt] = useState('');
  const [userAccountToUpdate, setUserAccountToUpdate] = useState<any>(null);
  const [userAccountPasswordToUpdate, setUserAccountPasswordToUpdate] = useState<any>(null);
  const [userAccountToDelete, setUserAccountToDelete] = useState<any>(null);

  return (
    <div className="mt-5">
      <CreateUser
        setLastUserAccountChangesAt={setLastUserAccountChangesAt}
      />
      <UpdateUser
        userAccountToUpdate={userAccountToUpdate}
        setUserAccountToUpdate={setUserAccountToUpdate}
        setLastUserAccountChangesAt={setLastUserAccountChangesAt}
      />
      <UpdateUserPassword
        userAccountPasswordToUpdate={userAccountPasswordToUpdate}
        setUserAccountPasswordToUpdate={setUserAccountPasswordToUpdate}
        setLastUserAccountChangesAt={setLastUserAccountChangesAt}
      />
      <DeleteUser
        userAccountToDelete={userAccountToDelete}
        setUserAccountToDelete={setUserAccountToDelete}
        setLastUserAccountChangesAt={setLastUserAccountChangesAt}
      />
      <div className="my-5">
        <ListUsers
          lastUserAccountChangesAt={lastUserAccountChangesAt}
          setUserAccountToUpdate={setUserAccountToUpdate}
          setUserAccountPasswordToUpdate={setUserAccountPasswordToUpdate}
          setUserAccountToDelete={setUserAccountToDelete}
        />
      </div>
    </div>
  );
}