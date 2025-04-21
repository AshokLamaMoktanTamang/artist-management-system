import { PRIVATE_ROUTES } from '@/utils/constants';
import { ChildrenRouteElement, RouteType } from './type';

const type = RouteType.PRIVATE;

export const fullLayoutRoutes: ChildrenRouteElement[] = [
  {
    path: PRIVATE_ROUTES.home,
    type,
    component: async () => {
      const { Dashboard } = await import('@/pages/dashboard');
      return Dashboard;
    },
  },
  {
    path: PRIVATE_ROUTES.users,
    type,
    component: async () => {
      const { UserListPage } = await import('@/pages/userListingPages');
      return UserListPage;
    },
  },
];
