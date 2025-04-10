import { USER_ROLE } from '@/types';

export type LoginPayload = {
  email: string;
  password: string;
  role: USER_ROLE;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};
