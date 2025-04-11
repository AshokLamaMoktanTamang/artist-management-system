import { useWhoAmIQuery } from '@/store/slices/user.slice';
import { LoginResponse } from '@/store/types';
import { PRIVATE_ROUTES } from '@/utils/constants';
import { getItem, setItem } from '@shared/index';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
  const token = getItem('token');

  const {
    data: user,
    refetch: refetchUser,
    isLoading: isUserLoading,
  } = useWhoAmIQuery(undefined, { skip: !token });

  const loginHandler = useCallback(
    ({ accessToken, refreshToken }: LoginResponse) => {
      setItem('token', accessToken);
      setItem('refresh-token', refreshToken);
      navigate(PRIVATE_ROUTES.home);
    },
    []
  );

  return { loginHandler, user, refetchUser, isUserLoading };
};

export default useAuth;
