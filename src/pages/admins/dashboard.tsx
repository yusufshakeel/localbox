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
import {Pages} from '@/configs/pages';

function AdminDashboardPage() {
  return (
    <BaseLayout pageTitle={Pages.adminsDashboard.title}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 mb-10">
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <UserManagementComponent/>
            </TabsContent>
            <TabsContent value="pages">
              <PageManagementComponent/>
            </TabsContent>
            <TabsContent value="settings">
              <UserManagementComponent/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BaseLayout>
  );
}

export default WithAuth(AdminDashboardPage, {
  userType: UserType.admin
});