import baseApi from '@/store/baseApi';
import {
  DeleteUserPayload,
  GetUsersPayload,
  IGeUsersResponse,
  IUpdateUserPayload,
  SignupPayload,
  UserDetail,
} from '../types';

const userApiSlice = baseApi
  .enhanceEndpoints({ addTagTypes: ['users', 'artists'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      whoAmI: builder.query<UserDetail, void>({
        query: () => ({
          url: `user/whoami`,
          method: 'GET',
        }),
      }),
      getUserDetail: builder.query<UserDetail, { id: string }>({
        query: ({ id }) => ({
          url: `user/detail/${id}`,
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
      getAllArtists: builder.query<IGeUsersResponse, GetUsersPayload>({
        query: (params) => ({
          url: `user/artists`,
          method: 'GET',
          params,
        }),
        providesTags: ['artists'],
      }),
      deleteUser: builder.mutation<UserDetail, DeleteUserPayload>({
        query: ({ userId }) => ({
          url: `user/${userId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['users', 'artists'],
      }),
      addUser: builder.mutation<UserDetail, SignupPayload>({
        query: (data) => ({
          url: `user`,
          method: 'POST',
          data,
        }),
        invalidatesTags: ['users', 'artists'],
      }),
      updateUser: builder.mutation<UserDetail, IUpdateUserPayload>({
        query: ({ userId, ...data }) => ({
          url: `user/${userId}`,
          method: 'PATCH',
          data,
        }),
        invalidatesTags: ['users', 'artists'],
      }),
    }),
  });

export const {
  useWhoAmIQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useAddUserMutation,
  useUpdateUserMutation,
  useGetAllArtistsQuery,
  useGetUserDetailQuery,
} = userApiSlice;
