import { baseApi } from '../../api/baseApi'
import { UserProfileResponse } from '../../../../types/userTypes'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: '/users/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    createCustomerPortal: builder.mutation<{ success: boolean; message: string; data: { url: string } }, void>({
      query: () => ({
        url: '/payments/customer-portal',
        method: 'POST',
      }),
    }),
    getAllUsers: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
})

export const { useGetProfileQuery, useLazyGetProfileQuery, useCreateCustomerPortalMutation, useGetAllUsersQuery } = userApi
