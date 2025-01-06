import ListUsers from '@/components/admin/users/ListUsers';
import CreateUser from '@/components/admin/users/CreateUser';

export default function UserManagementComponent() {
  return (
    <div className="mt-5">
      <CreateUser />
      <div className="my-5">
        <ListUsers/>
      </div>
    </div>
  );
}