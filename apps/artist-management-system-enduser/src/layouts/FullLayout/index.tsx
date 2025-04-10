import { SidebarInset, SidebarProvider } from '@/components/sidebar';
import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './appSidebar';
import { SiteHeader } from './siteHeader';

const FullLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
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
