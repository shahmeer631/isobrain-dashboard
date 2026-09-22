import { baseApi } from "../../api/baseApi";
import { DashboardStatsResponse, AnalyticsResponse, UsageUnitsResponse, TransactionResponse } from "@/types/dashboard";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    getAnalyticsReports: builder.query<AnalyticsResponse, void>({
      query: () => "/dashboard/analytics",
      providesTags: ["Dashboard"],
    }),
    getUsageUnits: builder.query<UsageUnitsResponse, void>({
      query: () => "/dashboard/usage-units",
      providesTags: ["Dashboard"],
    }),
    updateUsageUnits: builder.mutation<{ success: boolean; message: string }, { planName: string; learningUnits: number }>({
      query: (body) => ({
        url: "/dashboard/usage-units", // Assuming same url with PATCH/POST for update based on typical patterns. If unknown, I'll guess PATCH/PUT. 
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Dashboard"],
    }),
    getTransactions: builder.query<TransactionResponse, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({
        url: "/dashboard/transactions",
        params,
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { 
  useGetDashboardStatsQuery, 
  useGetAnalyticsReportsQuery,
  useGetUsageUnitsQuery,
  useUpdateUsageUnitsMutation,
  useGetTransactionsQuery
} = dashboardApi;
