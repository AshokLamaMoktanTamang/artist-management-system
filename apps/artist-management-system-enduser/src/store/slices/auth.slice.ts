import baseApi from '@/store/baseApi';
import { LoginPayload, LoginResponse } from '../types';

const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (data) => ({
        url: `auth/login`,
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
