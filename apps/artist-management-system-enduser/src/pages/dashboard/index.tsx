import useAuth from '@/hooks/useAuth';
import { USER_ROLE } from '@/types';
import ArtistDashboard from './common/ArtistDashboard';
import { Navigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from '@/utils/constants';

export const Dashboard = () => {
  const { user, isUserLoading } = useAuth();

  if (!user || isUserLoading) return;

  const { role } = user;

  if (role !== USER_ROLE.ARTIST) {
    return <Navigate to={PRIVATE_ROUTES.artists} replace />;
  }

  return <ArtistDashboard />;
};
