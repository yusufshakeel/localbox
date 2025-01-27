import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent, SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, SidebarRail
} from '@/components/ui/sidebar';
import {Server} from 'lucide-react';
import {PROTECTED_PAGES, Pages, HOME_PAGE, INFO_PAGE} from '@/configs/pages';
import Link from 'next/link';
import {useAppContext} from '@/context/AppContext';
import {WEBSITE_NAME} from '@/constants';
import {useSession} from 'next-auth/react';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {hasPermissions} from '@/utils/permissions';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {ip, port, localServerAddress} = useAppContext();
  const {data: session} = useSession() as any;

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
                  <Link href={HOME_PAGE.link}>
                    <HOME_PAGE.icon />
                    <span>{HOME_PAGE.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {
                PROTECTED_PAGES
                  .filter(page => {
                    return !session || hasPermissions(session, page.permissions);
                  })
                  .map((page) => (
                    <SidebarMenuItem key={page.title}>
                      <SidebarMenuButton asChild>
                        <Link href={page.link}>
                          <page.icon />
                          <span>{page.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
              }
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={INFO_PAGE.link}>
                    <INFO_PAGE.icon />
                    <span>{INFO_PAGE.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={localServerAddress}>
                    <Server/>
                    <span>{ip}:{port}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {
        session && (
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href={
                  hasPermissions(session, Pages.profile.permissions)
                    ? Pages.profile.link
                    : Pages.home.link
                }>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">{session.user.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight p-2">
                      <span className="truncate font-semibold">{session.user.username}</span>
                      <span className="truncate text-xs">{session.user.displayName}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        )
      }
      <SidebarRail/>
    </Sidebar>
  );
}
