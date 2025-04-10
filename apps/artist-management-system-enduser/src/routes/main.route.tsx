import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';

import { PrivateRoute, PublicRoute } from './route';

import { ChildrenRouteElement, RouteType } from './type';
import { getItem } from '@shared/index';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/utils/constants';
import { authLayoutRoutes, staticLayoutRoutes } from './public.route';
import ErrorBoundary from '@shared/components/ErrorBoundary';
import { AuthLayout, FullLayout, StaticLayout } from '@/layouts';
import { fullLayoutRoutes } from './private.route';

const RouteWrapperComponent = (routeType: RouteType, component: any) => {
  const ComponentWrapped = component;

  if (routeType === RouteType.PRIVATE) {
    return (
      <PrivateRoute>
        <ComponentWrapped />
      </PrivateRoute>
    );
  }

  return (
    <PublicRoute>
      <ComponentWrapped />
    </PublicRoute>
  );
};

const token = getItem<string>('token');

const ChildrenMapper = (
  routeType: RouteType,
  routes: ChildrenRouteElement[]
): RouteObject[] | undefined =>
  routes.map((item) => ({
    path: item.path,
    lazy: async () => {
      const ImportComponent = await item.component();
      return {
        Component: () => RouteWrapperComponent(routeType, ImportComponent),
      };
    },
  }));

const Routes = createBrowserRouter([
  {
    path: '',
    errorElement: (
      <FullLayout>
        <ErrorBoundary homeRoutePath="home" />
      </FullLayout>
    ),
    element: (
      <Navigate
        to={token ? PRIVATE_ROUTES.home : PUBLIC_ROUTES.login}
        replace
      />
    ),
  },
  {
    element: <AuthLayout />,
    errorElement: <ErrorBoundary homeRoutePath="home" />,
    children: ChildrenMapper(RouteType.PUBLIC, authLayoutRoutes),
  },
  {
    element: <StaticLayout />,
    errorElement: <ErrorBoundary homeRoutePath="home" />,
    children: ChildrenMapper(RouteType.PUBLIC, staticLayoutRoutes),
  },
  {
    element: <FullLayout />,
    errorElement: (
      <FullLayout>
        <ErrorBoundary homeRoutePath="home" />
      </FullLayout>
    ),
    children: ChildrenMapper(RouteType.PRIVATE, fullLayoutRoutes),
  },
]);

export default Routes;
