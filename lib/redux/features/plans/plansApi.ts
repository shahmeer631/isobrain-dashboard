"use client";

import { ICreatePlanRequest, IPlanResponse, IPlansResponse, IUpdatePlanRequest } from "@/types/planTypes";
import { baseApi } from "../../api/baseApi";


export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<IPlansResponse, void>({
      query: () => "/plans",
      providesTags: ["Plans"],
    }),
    getSinglePlan: builder.query<IPlanResponse, string>({
      query: (id) => `/plans/${id}`,
      providesTags: (result, error, id) => [{ type: "Plans", id }],
    }),
    createPlan: builder.mutation<IPlanResponse, ICreatePlanRequest>({
      query: (body) => ({
        url: "/plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Plans"],
    }),
    updatePlan: builder.mutation<
      IPlanResponse,
      { id: string; body: IUpdatePlanRequest }
    >({
      query: ({ id, body }) => ({
        url: `/plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["Plans", { type: "Plans", id }],
    }),
    deletePlan: builder.mutation<IPlanResponse, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plans"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetSinglePlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;
