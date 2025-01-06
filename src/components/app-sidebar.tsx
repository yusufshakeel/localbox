import React from 'react';
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
import {LOGGED_IN_ADMIN_PAGES, LOGGED_IN_USER_PAGES, PAGES} from '@/configs/pages';
import Link from 'next/link';
import {useAppContext} from '@/context/AppContext';
import {WEBSITE_NAME} from '@/constants';
import {useSession} from 'next-auth/react';
import {UserType} from '@/types/users';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {ip, port, localServerAddress} = useAppContext();
  const {data: session} = useSession() as any;

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
                  <Link href={localServerAddress}>
                    <Server/>
                    <span>{ip}:{port}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {
          session && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {LOGGED_IN_USER_PAGES.map((page) => (
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
          )
        }

        {
          session?.user?.type === UserType.admin && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {LOGGED_IN_ADMIN_PAGES.map((page) => (
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
          )
        }
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
