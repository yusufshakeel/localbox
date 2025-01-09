import React from 'react';
import {Home, Moon, Sun, User} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {SidebarInset, SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/app-sidebar';
import {Separator} from '@/components/ui/separator';
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage} from '@/components/ui/breadcrumb';
import Head from 'next/head';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import Link from 'next/link';
import {SetAppSidebar} from '@/components/setup-app-sidebar';
import {useSession} from 'next-auth/react';
import {handleSignOut} from '@/services/auth-service';
import {UserType} from '@/types/users';
import {Pages} from '@/configs/pages';

export default function BaseLayout({
  children,
  pageTitle,
  isSetupPage
}: { children: React.ReactNode, pageTitle: string, isSetupPage?: boolean }) {
  const { setTheme } = useTheme();
  const {data: session} = useSession() as any;

  return (
    <>
      <Head>{htmlHeadContentHelper({ title: pageTitle })}</Head>
      <SidebarProvider>
        {
          isSetupPage
            ? <SetAppSidebar/>
            : <AppSidebar />
        }
        <SidebarInset>
          <div className="sticky top-0 bg-background z-10 shadow">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="h-4"/>
                <Link href={Pages.home.link}>
                  <Button variant="ghost">
                    <Home/>
                  </Button>
                </Link>
                <Separator orientation="vertical" className="h-4"/>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex ms-auto">
                {
                  session?.user
                    ? (
                      <div className="ms-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <User/>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Username: {session.user.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={Pages.profile.link}>Profile</Link>
                            </DropdownMenuItem>
                            {
                              session?.user?.type === UserType.admin &&
                              <DropdownMenuItem asChild>
                                <Link href={Pages.adminsDashboard.link}>Admin Dashboard</Link>
                              </DropdownMenuItem>
                            }
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>Log out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )
                    : (
                      <Link href={Pages.login.link}>
                        <Button variant="default">Log in</Button>
                      </Link>
                    )
                }
                <div className="ms-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Sun
                          className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                        <Moon
                          className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                        <span className="sr-only">Toggle theme</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme('light')}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}