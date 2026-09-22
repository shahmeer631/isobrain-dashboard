import { IISOStandardsResponse, ISOStandard } from '@/types/iso-standards';
import { baseApi } from '../../api/baseApi';

export const isoStandardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getISOStandards: builder.query<IISOStandardsResponse, { search?: string; status?: string; page?: number; limit?: number } | void>({
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
          url: `/iso-standards${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'ISOStandards' as const, id })),
              { type: 'ISOStandards', id: 'LIST' },
            ]
          : [{ type: 'ISOStandards', id: 'LIST' }],
    }),
    getISOStandardById: builder.query<{ success: boolean; message: string; data: ISOStandard }, string>({
      query: (id) => ({
        url: `/iso-standards/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'ISOStandards', id }],
    }),
    createISOStandard: builder.mutation<{ success: boolean; message: string; data: ISOStandard }, Partial<ISOStandard>>({
      query: (body) => ({
        url: '/iso-standards',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ISOStandards', id: 'LIST' }],
    }),
    updateISOStandard: builder.mutation<{ success: boolean; message: string; data: ISOStandard }, { id: string; body: Partial<ISOStandard> }>({
      query: ({ id, body }) => ({
        url: `/iso-standards/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ISOStandards', id },
        { type: 'ISOStandards', id: 'LIST' },
      ],
    }),
    deleteISOStandard: builder.mutation<{ success: boolean; message: string; data: ISOStandard }, string>({
      query: (id) => ({
        url: `/iso-standards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ISOStandards', id: 'LIST' }],
    }),
  }),
});

export const { 
  useGetISOStandardsQuery, 
  useGetISOStandardByIdQuery, 
  useCreateISOStandardMutation, 
  useUpdateISOStandardMutation,
  useDeleteISOStandardMutation
} = isoStandardApi;
