import {
  ICouponResponse,
  ICouponsResponse,
  ICreateCouponRequest,
  IUpdateCouponRequest,
} from "@/types/couponTypes";
import { baseApi } from "../../api/baseApi";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<ICouponsResponse, void>({
      query: () => ({
        url: "/coupons",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({
                type: "Coupons" as const,
                id,
              })),
              { type: "Coupons", id: "LIST" },
            ]
          : [{ type: "Coupons", id: "LIST" }],
    }),
    getCouponById: builder.query<ICouponResponse, string>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Coupons", id }],
    }),
    createCoupon: builder.mutation<ICouponResponse, ICreateCouponRequest>({
      query: (body) => ({
        url: "/coupons",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Coupons", id: "LIST" }],
    }),
    updateCoupon: builder.mutation<
      ICouponResponse,
      { id: string; body: IUpdateCouponRequest }
    >({
      query: ({ id, body }) => ({
        url: `/coupons/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Coupons", id },
        { type: "Coupons", id: "LIST" },
      ],
    }),
    deleteCoupon: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Coupons", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
