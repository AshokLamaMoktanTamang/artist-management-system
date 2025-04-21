import baseApi from '@/store/baseApi';
import {
  DeleteUserPayload,
  GetUsersPayload,
  IGeUsersResponse,
  UserDetail,
} from '../types';

const userApiSlice = baseApi
  .enhanceEndpoints({ addTagTypes: ['users'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      whoAmI: builder.query<UserDetail, void>({
        query: () => ({
          url: `user/whoami`,
          method: 'GET',
        }),
      }),
      getAllUsers: builder.query<IGeUsersResponse, GetUsersPayload>({
        query: (params) => ({
          url: `user/all`,
          method: 'GET',
          params,
        }),
        providesTags: ['users'],
      }),
      deleteUser: builder.mutation<UserDetail, DeleteUserPayload>({
        query: ({ userId }) => ({
          url: `user/${userId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['users'],
      }),
    }),
  });

export const { useWhoAmIQuery, useGetAllUsersQuery, useDeleteUserMutation } =
  userApiSlice;
