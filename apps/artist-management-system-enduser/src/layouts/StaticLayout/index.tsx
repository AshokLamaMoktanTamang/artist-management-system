import { Button } from '@/components/button';
import { PUBLIC_ROUTES } from '@/utils/constants';
import { FC, PropsWithChildren } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const StaticLayout: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Button
        onClick={() => navigate(PUBLIC_ROUTES.login)}
        className="absolute top-[1.5rem] left-[1.5rem]"
      >
        Go Home
      </Button>
      <div className="w-full max-w-sm md:max-w-3xl">
        {children ?? <Outlet />}
      </div>
    </div>
  );
};

export default StaticLayout;
