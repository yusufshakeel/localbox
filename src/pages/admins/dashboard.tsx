import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import BaseLayout from '@/layouts/BaseLayout';
import {WithAuth} from '@/components/with-auth';
import {UserType} from '@/types/users';
import UserManagementComponent from '../../components/admins/admin-dashboard/users';
import PageManagementComponent from '@/components/admins/admin-dashboard/pages';

function AdminDashboardPage() {
  return (
    <BaseLayout pageTitle={'Admin Dashboard'}>
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagementComponent/>
        </TabsContent>
        <TabsContent value="pages">
          <PageManagementComponent/>
        </TabsContent>
      </Tabs>
    </BaseLayout>
  );
}

export default WithAuth(AdminDashboardPage, {
  userType: UserType.admin
});