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
  {
    path: PRIVATE_ROUTES.artists,
    type,
    component: async () => {
      const { ArtistListingPage } = await import('@/pages/userListingPages');
      return ArtistListingPage;
    },
  },
  {
    path: PRIVATE_ROUTES.artistDetail,
    type,
    component: async () => {
      const { ArtistDetailPage } = await import('@/pages/userListingPages');
      return ArtistDetailPage;
    },
  },
];
