import { IVideo, IVideoResponse, ICreateVideoResponse } from '@/types/videoTypes';
import { baseApi } from '../../api/baseApi';

export const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query<IVideoResponse, { search?: string; status?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.search) queryParams.append('search', params.search);
          if (params.status && params.status !== "All") queryParams.append('status', params.status.toUpperCase());
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
        }
        const queryString = queryParams.toString();
        return {
          url: `/videos${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Videos' as const, id })),
              { type: 'Videos', id: 'LIST' },
            ]
          : [{ type: 'Videos', id: 'LIST' }],
    }),
    getVideoById: builder.query<{ success: boolean; message: string; data: IVideo }, string>({
      query: (id) => ({
        url: `/videos/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Videos', id }],
    }),
    createVideo: builder.mutation<ICreateVideoResponse, Partial<IVideo & { courseId: string }>>({
      query: (body) => ({
        url: '/videos',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Videos', id: 'LIST' }],
    }),
    updateVideo: builder.mutation<{ success: boolean; message: string; data: IVideo }, { id: string; body: Partial<IVideo & { courseId: string }> }>({
      query: ({ id, body }) => ({
        url: `/videos/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Videos', id },
        { type: 'Videos', id: 'LIST' },
      ],
    }),
    deleteVideo: builder.mutation<{ success: boolean; message: string; data: IVideo }, string>({
      query: (id) => ({
        url: `/videos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Videos', id: 'LIST' }],
    }),
  }),
});

export const { 
  useGetVideosQuery, 
  useGetVideoByIdQuery, 
  useCreateVideoMutation, 
  useUpdateVideoMutation,
  useDeleteVideoMutation
} = videoApi;
