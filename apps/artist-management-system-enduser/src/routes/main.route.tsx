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
  debugger;
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
  routes: ChildrenRouteElement[]
): RouteObject[] | undefined =>
  routes.map((item) => ({
    path: item.path,
    lazy: async () => {
      const ImportComponent = await item.component();
      return {
        Component: () => RouteWrapperComponent(item.type, ImportComponent),
      };
    },
    ...(item?.children && {
      children: item.children?.map((child: any) => {
        return {
          path: child?.path,
          lazy: async () => {
            const ImportComponent = await child.component()
            return {
              Component: ImportComponent,
            }
          },
        }
      }),
    }),
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
    children: ChildrenMapper(authLayoutRoutes),
  },
  {
    element: <StaticLayout />,
    errorElement: <ErrorBoundary homeRoutePath="home" />,
    children: ChildrenMapper(staticLayoutRoutes),
  },
  {
    element: <FullLayout />,
    errorElement: (
      <FullLayout>
        <ErrorBoundary homeRoutePath="home" />
      </FullLayout>
    ),
    children: ChildrenMapper(fullLayoutRoutes),
  },
]);

export default Routes;
