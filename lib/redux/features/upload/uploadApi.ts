import { baseApi } from '../../api/baseApi';

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<{ success: boolean; message: string; data: { url: string } }, FormData>({
      query: (formData) => ({
        url: '/uploads/single',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadFiles: builder.mutation<{ success: boolean; message: string; data: { urls: string[] } }, FormData>({
      query: (formData) => ({
        url: '/uploads/multiple',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadFileMutation, useUploadFilesMutation } = uploadApi;
