import { IBundle, IBundleResponse, IBundleRequest } from '@/types/bundles';
import { baseApi } from '../../api/baseApi';

export const bundleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBundles: builder.query<IBundleResponse, { search?: string; status?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.search) queryParams.append('search', params.search);
          if (params.status && params.status !== "All Standards") queryParams.append('status', params.status.toUpperCase());
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
        }
        const queryString = queryParams.toString();
        return {
          url: `/bundles${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Bundles' as const, id })),
              { type: 'Bundles', id: 'LIST' },
            ]
          : [{ type: 'Bundles', id: 'LIST' }],
    }),
    getBundleById: builder.query<{ success: boolean; message: string; data: IBundle }, string>({
      query: (id) => ({
        url: `/bundles/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Bundles', id }],
    }),
    createBundle: builder.mutation<{ success: boolean; message: string; data: IBundle }, IBundleRequest>({
      query: (body) => ({
        url: '/bundles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Bundles', id: 'LIST' }],
    }),
    updateBundle: builder.mutation<{ success: boolean; message: string; data: IBundle }, { id: string; body: Partial<IBundleRequest> }>({
      query: ({ id, body }) => ({
        url: `/bundles/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Bundles', id },
        { type: 'Bundles', id: 'LIST' },
      ],
    }),
    deleteBundle: builder.mutation<{ success: boolean; message: string; data: IBundle }, string>({
      query: (id) => ({
        url: `/bundles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Bundles', id: 'LIST' }],
    }),
  }),
});

export const { 
  useGetBundlesQuery, 
  useGetBundleByIdQuery, 
  useCreateBundleMutation, 
  useUpdateBundleMutation,
  useDeleteBundleMutation
} = bundleApi;
