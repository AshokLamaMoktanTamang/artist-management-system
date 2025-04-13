import baseApi from '@/store/baseApi';
import { axios } from '@shared/index';
import { toastError } from '@shared/utils/toast';
import { IAddAlbumPayload } from '../types';

const albumApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    albumPresignedUrl: builder.mutation<{ data: string }, File>({
      queryFn: async (file) => {
        try {
          const data = await axios.post('album/presigned-url', {
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
    addAlbum: builder.mutation<void, IAddAlbumPayload>({
      query: (data) => ({
        url: 'album',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useAlbumPresignedUrlMutation, useAddAlbumMutation } =
  albumApiSlice;
