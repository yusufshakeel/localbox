import BaseLayout from '@/layouts/BaseLayout';
import {WithAuth} from '@/components/with-auth';
import {UserType} from '@/types/users';

function AdminDashboardPage() {
  return (
    <BaseLayout pageTitle={'Admin Dashboard'}>
      <div className="grid gap-4">
        <h1>Admin Dashboard</h1>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(AdminDashboardPage, { userType: UserType.admin });