import { LoginResponse } from '@/store/types';
import { PRIVATE_ROUTES } from '@/utils/constants';
import { setItem } from '@shared/index';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();

  const loginHandler = useCallback(
    ({ accessToken, refreshToken }: LoginResponse) => {
      setItem('token', accessToken);
      setItem('refresh-token', refreshToken);
      navigate(PRIVATE_ROUTES.home);
    },
    []
  );

  return { loginHandler };
};

export default useAuth;
