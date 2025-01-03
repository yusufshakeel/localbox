import React from 'react';
import {SidebarInset, SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/app-sidebar';
import {Separator} from '@/components/ui/separator';
import {Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage} from '@/components/ui/breadcrumb';
import Head from 'next/head';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';

export default function BaseLayout(
  { children, pageTitle }: { children: React.ReactNode, pageTitle: string }
) {
  return (
    <>
      <Head>{htmlHeadContentHelper({ title: pageTitle })}</Head>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="sticky top-0 bg-background z-10 shadow">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
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