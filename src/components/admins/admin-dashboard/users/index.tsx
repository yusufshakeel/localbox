import {useState} from 'react';
import ListUsers from '@/components/admins/admin-dashboard/users/ListUsers';
import CreateUser from '@/components/admins/admin-dashboard/users/CreateUser';
import UpdateUser from '@/components/admins/admin-dashboard/users/UpdateUser';
import DeleteUser from '@/components/admins/admin-dashboard/users/DeleteUser';
import UpdateUserPassword from '@/components/admins/admin-dashboard/users/UpdateUserPassword';
import UpdateUserPermissions from '@/components/admins/admin-dashboard/users/UpdateUserPermissions';

export default function UserManagementComponent() {
  const [lastUserAccountChangesAt, setLastUserAccountChangesAt] = useState('');
  const [userAccountToUpdate, setUserAccountToUpdate] = useState<any>(null);
  const [userAccountPasswordToUpdate, setUserAccountPasswordToUpdate] = useState<any>(null);
  const [userAccountPermissionsToUpdate, setUserAccountPermissionsToUpdate] = useState<any>(null);
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
      <UpdateUserPermissions
        userAccountPermissionsToUpdate={userAccountPermissionsToUpdate}
        setUserAccountPermissionsToUpdate={setUserAccountPermissionsToUpdate}
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
          setUserAccountPermissionsToUpdate={setUserAccountPermissionsToUpdate}
          setUserAccountToDelete={setUserAccountToDelete}
        />
      </div>
    </div>
  );
}