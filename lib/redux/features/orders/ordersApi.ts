import { OrdersResponse } from "@/types/orders";
import { baseApi } from "../../api/baseApi";

// Define Types based on your API response

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrdersResponse, void>({
      query: () => ({
        url: "/dashboard/orders",
      }),
      providesTags: ["Orders"], // Optional: for caching/invalidation
    }),
  }),
});

export const { useGetAllOrdersQuery } = orderApi;
