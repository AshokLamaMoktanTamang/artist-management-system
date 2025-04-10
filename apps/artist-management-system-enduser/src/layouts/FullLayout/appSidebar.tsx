import * as React from 'react';
import {
  ArrowUpCircleIcon,
  FolderIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';

import { NavMain } from '@/components/navMain';
import { NavSecondary } from '@/components/navSecondary';
import { NavUser } from '@/components/navUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/sidebar';
import { Link } from 'react-router-dom';
import { PRIVATE_ROUTES } from '@/utils/constants';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: 'Dashboard',
        url: PRIVATE_ROUTES.home,
        icon: LayoutDashboardIcon,
      },
      {
        title: 'Users',
        url: PRIVATE_ROUTES.users,
        icon: UsersIcon,
      },
      {
        title: 'Artists',
        url: PRIVATE_ROUTES.artists,
        icon: FolderIcon,
      },
    ],
    navSecondary: [
      {
        title: 'Bulk Upload',
        url: PRIVATE_ROUTES.bulkUpload,
        icon: SettingsIcon,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={PRIVATE_ROUTES.home}>
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">
                  Artist Management System
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
