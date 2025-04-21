import baseApi from '@/store/baseApi';
import {
  DeleteUserPayload,
  GetUsersPayload,
  IGeUsersResponse,
  IUpdateUserPayload,
  SignupPayload,
  UserDetail,
} from '../types';
import { axios } from '@shared/index';
import { toastError } from '@shared/utils/toast';

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
      getBulkPresignedUrl: builder.mutation<{ data: string }, File>({
        queryFn: async (file) => {
          try {
            const data = await axios.post('user/presigned-url');
            const { url, fileKey } = data as unknown as {
              url: string;
              fileKey: string;
            };

            const formData = new FormData();
            formData.append('file', file);
            await axios.put(url, formData);

            return { data: fileKey } as any;
          } catch (error) {
            const err = error as { message: string[] | string };
            const message = Array.isArray(err?.message)
              ? err?.message[0]
              : err?.message;
            toastError(message);
            return { data: '' };
          }
        },
      }),
      initiateBulkUpload: builder.mutation<void, { fileKey: string }>({
        query: (data) => ({
          url: `user/bulk-upload/initiate`,
          method: 'POST',
          data,
        }),
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
  useGetBulkPresignedUrlMutation,
  useInitiateBulkUploadMutation
} = userApiSlice;
