import baseApi from '@/store/baseApi';
import { axios } from '@shared/index';
import { toastError } from '@shared/utils/toast';
import {
  IAddMusicPayload,
  IGetMusicsPayload,
  IGetMusicsResponse,
} from '../types';

const musicApiSlice = baseApi
  .enhanceEndpoints({ addTagTypes: ['music'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      musicPresignedUrl: builder.mutation<{ data: string }, File>({
        queryFn: async (file) => {
          try {
            const data = await axios.post('music/presigned-url', {
              fileName: file.name,
              fileType: file.type,
            });
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
      addMusic: builder.mutation<void, IAddMusicPayload>({
        query: (data) => ({
          url: 'music',
          method: 'POST',
          data,
        }),
        invalidatesTags: ['music'],
      }),
      deleteMusic: builder.mutation<void, { id: string }>({
        query: ({ id }) => ({
          url: `music/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['music'],
      }),
      fetchMusics: builder.query<IGetMusicsResponse, IGetMusicsPayload>({
        query: (params) => ({
          url: 'music',
          method: 'GET',
          params,
        }),
        providesTags: ['music'],
      }),
    }),
  });

export const {
  useMusicPresignedUrlMutation,
  useAddMusicMutation,
  useFetchMusicsQuery,
  useDeleteMusicMutation,
} = musicApiSlice;
