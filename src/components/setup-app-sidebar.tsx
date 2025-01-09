import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent, SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, SidebarRail
} from '@/components/ui/sidebar';
import {Settings} from 'lucide-react';
import Link from 'next/link';
import {WEBSITE_NAME} from '@/constants';
import {Pages} from '@/configs/pages';

export function SetAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={Pages.home.link}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span>☁️</span>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold">{WEBSITE_NAME}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={Pages.setup.link}>
                    <Settings/>
                    <span>Setup</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
