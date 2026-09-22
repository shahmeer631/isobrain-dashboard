import { IAffiliateResponse, IAffiliatesResponse, IAffiliateStatsResponse, ICreateAffiliateRequest, IUpdateAffiliateRequest } from "@/types/affiliateTypes";
import { baseApi } from "../../api/baseApi";

export const affiliateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliates: builder.query<IAffiliatesResponse, { search?: string; status?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.search) queryParams.append("search", params.search);
          if (params.status && params.status !== "All") queryParams.append("status", params.status);
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
        }
        const queryString = queryParams.toString();
        return {
          url: `/affiliates${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Affiliates" as const, id })),
              { type: "Affiliates", id: "LIST" },
            ]
          : [{ type: "Affiliates", id: "LIST" }],
    }),
    getAffiliateStats: builder.query<IAffiliateStatsResponse, void>({
      query: () => ({
        url: "/affiliates/stats",
        method: "GET",
      }),
      providesTags: ["Affiliates"],
    }),
    createAffiliate: builder.mutation<IAffiliateResponse, ICreateAffiliateRequest>({
      query: (body) => ({
        url: "/affiliates",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Affiliates", id: "LIST" }],
    }),
    updateAffiliate: builder.mutation<IAffiliateResponse, { id: string; body: IUpdateAffiliateRequest }>({
      query: ({ id, body }) => ({
        url: `/affiliates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Affiliates", id },
        { type: "Affiliates", id: "LIST" },
      ],
    }),
    deleteAffiliate: builder.mutation<IAffiliateResponse, string>({
      query: (id) => ({
        url: `/affiliates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Affiliates", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAffiliatesQuery,
  useGetAffiliateStatsQuery,
  useCreateAffiliateMutation,
  useUpdateAffiliateMutation,
  useDeleteAffiliateMutation,
} = affiliateApi;
