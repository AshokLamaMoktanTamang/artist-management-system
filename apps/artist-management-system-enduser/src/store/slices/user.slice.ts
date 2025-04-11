import baseApi from '@/store/baseApi';
import { UserDetail } from '../types';

const authApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    whoAmI: builder.query<UserDetail, void>({
      query: () => ({
        url: `user/whoami`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useWhoAmIQuery } = authApiSlice;
