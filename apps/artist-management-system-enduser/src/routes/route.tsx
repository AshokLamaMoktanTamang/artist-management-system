import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { RouteProps } from './type';
import { getItem } from '@shared/utils/storage';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/utils/constants';

const PrivateRoute: FC<RouteProps> = ({ children }) => {
  const token = getItem<string>('token');
  const location = useLocation();

  if (!token) {
    return (
      <Navigate to={PUBLIC_ROUTES.login} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};

const PublicRoute: FC<RouteProps> = ({ children }) => {
  const token = getItem<string>('token');
  const location = useLocation();

  if (token) {
    return (
      <Navigate to={PRIVATE_ROUTES.home} state={{ from: location }} replace />
    );
  }
  return children;
};

export { PrivateRoute, PublicRoute };
