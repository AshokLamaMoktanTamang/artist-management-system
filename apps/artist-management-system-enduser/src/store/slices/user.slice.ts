import baseApi from '@/store/baseApi';
import { UserDetail } from '../types';

const userApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    whoAmI: builder.query<UserDetail, void>({
      query: () => ({
        url: `user/whoami`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useWhoAmIQuery } = userApiSlice;
