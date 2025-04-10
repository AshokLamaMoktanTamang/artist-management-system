import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

const FullLayout: FC<PropsWithChildren> = ({ children }) => {
  return <>{children ?? <Outlet />}</>;
};

export default FullLayout;
