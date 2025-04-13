import baseApi from '@/store/baseApi';
import { LoginPayload, LoginResponse, SignupPayload } from '../types';

const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (data) => ({
        url: `auth/login`,
        method: 'POST',
        data,
      }),
    }),
    signup: builder.mutation<void, SignupPayload>({
      query: (data) => ({
        url: `auth/signup`,
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApiSlice;
