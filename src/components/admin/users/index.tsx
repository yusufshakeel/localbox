import ListUsers from '@/components/admin/users/ListUsers';
import CreateUser from '@/components/admin/users/CreateUser';
import {useState} from 'react';
import UpdateUser from '@/components/admin/users/UpdateUser';

export default function UserManagementComponent() {
  const [lastUserAccountChangesAt, setLastUserAccountChangesAt] = useState('');
  const [userAccountToUpdate, setUserAccountToUpdate] = useState<any>(null);

  return (
    <div className="mt-5">
      <CreateUser setLastUserAccountChangesAt={setLastUserAccountChangesAt}/>
      <UpdateUser
        userAccountToUpdate={userAccountToUpdate}
        setUserAccountToUpdate={setUserAccountToUpdate}
        setLastUserAccountChangesAt={setLastUserAccountChangesAt}
      />
      <div className="my-5">
        <ListUsers
          lastUserAccountChangesAt={lastUserAccountChangesAt}
          setLastUserAccountChangesAt={setLastUserAccountChangesAt}
          setUserAccountToUpdate={setUserAccountToUpdate}
        />
      </div>
    </div>
  );
}