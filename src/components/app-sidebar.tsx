import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent, SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, SidebarRail
} from '@/components/ui/sidebar';
import {Server} from 'lucide-react';
import {PAGES} from '@/configs/pages';
import Link from 'next/link';
import {useAppContext} from '@/context/AppContext';
import {WEBSITE_NAME} from '@/constants';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {ip, port, info} = useAppContext();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
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
              {PAGES.map((page) => (
                <SidebarMenuItem key={page.title}>
                  <SidebarMenuButton asChild>
                    <Link href={page.link}>
                      <page.icon />
                      <span>{page.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div>
                    <Server/>
                    <span>{ip}:{port}</span>
                  </div>
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
