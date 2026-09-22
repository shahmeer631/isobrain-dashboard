import { Document, DocumentResponse } from '@/types/document';
import { baseApi } from '../../api/baseApi';

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<DocumentResponse, { search?: string; status?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.search) queryParams.append('search', params.search);
          if (params.status && params.status !== "All Documents" && params.status !== "All") queryParams.append('status', params.status.toUpperCase());
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
        }
        const queryString = queryParams.toString();
        // The API returns paginated documents on this endpoint
        return {
          url: `/documents${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Documents' as const, id })),
              { type: 'Documents', id: 'LIST' },
            ]
          : [{ type: 'Documents', id: 'LIST' }],
    }),
    getSingleDocument: builder.query<{ success: boolean; message: string; data: Document }, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Documents', id }],
    }),
    createDocument: builder.mutation<{ success: boolean; message: string; data: Document }, Partial<Document>>({
      query: (documentData) => ({
        url: '/documents',
        method: 'POST',
        body: documentData,
      }),
      invalidatesTags: [{ type: 'Documents', id: 'LIST' }],
    }),
    createBulkDocuments: builder.mutation<{ success: boolean; message: string; data?: unknown }, { categoryId: string; urls: string[] }>({
      query: (body) => ({
        url: '/documents/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Documents', id: 'LIST' }],
    }),
    updateDocument: builder.mutation<{ success: boolean; message: string; data: Document }, { id: string; body: Partial<Document> }>({
      query: ({ id, body }) => ({
        url: `/documents/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Documents', id: 'LIST' },
        { type: 'Documents', id },
      ],
    }),
    deleteDocument: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Documents', id: 'LIST' },
        { type: 'Documents', id },
      ],
    }),
  }),
});

export const { 
  useGetDocumentsQuery, 
  useGetSingleDocumentQuery,
  useCreateDocumentMutation,
  useCreateBulkDocumentsMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation
} = documentApi;
