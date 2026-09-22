import { baseApi } from '../../api/baseApi';

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  courseDesc?: string;
  standardDesc?: string;
  standardSub?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoriesResponse {
  success: boolean;
  message: string;
  data: ICategory[];
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ICategoriesResponse, void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Categories' as const, id })),
              { type: 'Categories', id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),
    createCategory: builder.mutation<{ success: boolean; message: string; data: ICategory }, Partial<ICategory>>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
    updateCategory: builder.mutation<{ success: boolean; message: string; data: ICategory }, { id: string; body: Partial<ICategory> }>({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),
    deleteCategory: builder.mutation<{ success: boolean; message: string; data: ICategory }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;

