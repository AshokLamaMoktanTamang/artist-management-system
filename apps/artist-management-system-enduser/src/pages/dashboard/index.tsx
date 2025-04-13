import useAuth from '@/hooks/useAuth';
import { USER_ROLE } from '@/types';
import ArtistDashboard from './common/ArtistDashboard';
import ManagerDashboard from './common/ManagerDashboard';
import AdminDashboard from './common/AdminDashboard';

export const Dashboard = () => {
  const { user, isUserLoading } = useAuth();

  if (!user || isUserLoading) return;

  const { role } = user;

  switch (role) {
    case USER_ROLE.ARTIST:
      return <ArtistDashboard />;
    case USER_ROLE.ARTIST_MANAGER:
      return <ManagerDashboard />;
    case USER_ROLE.SUPER_ADMIN:
      return <AdminDashboard />;

    default:
      return <>Dashboard not found</>;
  }
};
