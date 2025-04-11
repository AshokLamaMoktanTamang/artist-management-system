import { SidebarInset, SidebarProvider } from '@/components/sidebar';
import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './appSidebar';
import { SiteHeader } from './siteHeader';
import useAuth from '@/hooks/useAuth';

const FullLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user, isUserLoading, logoutHandler } = useAuth();

  if (isUserLoading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold animate-pulse">Loading...</div>
        <div className="hidden">{children ?? <Outlet />}</div>
      </div>
    );
  }

  if (!isUserLoading && !user) {
    logoutHandler();
    return;
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" className="fixed w-64 h-full" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 p-3">
              {children ?? <Outlet />}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default FullLayout;
