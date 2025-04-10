import { PUBLIC_ROUTES } from '@/utils/constants';
import { ChildrenRouteElement, RouteType } from './type';

const type = RouteType.PUBLIC;

export const authLayoutRoutes: ChildrenRouteElement[] = [
  {
    path: PUBLIC_ROUTES.login,
    type,
    component: async () => {
      const { LoginPage } = await import('@/pages/authPages');
      return LoginPage;
    },
  },
];

export const staticLayoutRoutes: ChildrenRouteElement[] = [
  {
    path: PUBLIC_ROUTES.policy,
    type,
    component: async () => {
      const { PrivacyPolicyPage } = await import('@/pages/staticPages');
      return PrivacyPolicyPage;
    },
  },
  {
    path: PUBLIC_ROUTES.terms,
    type,
    component: async () => {
      const { TermsPage } = await import('@/pages/staticPages');
      return TermsPage;
    },
  },
];
