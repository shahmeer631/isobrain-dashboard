/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ICommunityCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICommunity {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  visibility: "PUBLIC" | "PRIVATE";
  moderators: string[];
  icon: string | null;
  allowPosts: boolean;
  requireApproval: boolean;
  allowAttachments: boolean;
  emailNotifications: boolean;
  memberLimit: number | null;
  rules: string;
  membersCount: number;
  postsCount: number;
  engagement: string;
  status: "ACTIVE" | "ARCHIVED" | "PRIVATE";
  createdAt: string;
  updatedAt: string;
  category?: ICommunityCategory;
}

export interface ICommunityListResponse {
  success: boolean;
  message: string;
  data: {
    meta: { page: number; limit: number; total: number };
    data: ICommunity[];
  };
}

export interface ICommunityResponse {
  success: boolean;
  message: string;
  data: ICommunity;
}

export type CommunityVisibilityFilter = "PUBLIC" | "PRIVATE" | "ALL";

export interface IGetCommunitiesParams {
  visibility?: CommunityVisibilityFilter;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ICreateCommunityPayload {
  name: string;
  description: string;
  categoryId: string;
  moderators: string[];
  visibility: "PUBLIC" | "PRIVATE";
  allowPosts: boolean;
  requireApproval: boolean;
  allowAttachments: boolean;
  emailNotifications: boolean;
  memberLimit: number | null;
  rules: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const communityApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET /communities — visibility: PUBLIC | PRIVATE (omit for all)
    getCommunities: builder.query<ICommunityListResponse, IGetCommunitiesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.visibility && params.visibility !== "ALL") {
          queryParams.append("visibility", params.visibility);
        }
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        const qs = queryParams.toString();
        return `/communities${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: "Groups" as const, id })),
              { type: "Groups" as const, id: "LIST" },
            ]
          : [{ type: "Groups" as const, id: "LIST" }],
    }),

    // GET /communities/:id
    getSingleCommunity: builder.query<ICommunityResponse, string>({
      query: (id) => `/communities/${id}`,
      providesTags: (result, error, id) => [{ type: "Groups" as const, id }],
    }),

    // GET /categories
    getCategories: builder.query<{ data: any[] }, void>({
      query: () => "/categories",
    }),

    // POST /communities
    createCommunity: builder.mutation<ICommunityResponse, ICreateCommunityPayload>({
      query: (body) => ({
        url: "/communities",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),

    // PATCH /communities/:id
    updateCommunity: builder.mutation<
      ICommunityResponse,
      { id: string; data: Partial<ICreateCommunityPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/communities/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Groups" as const, id: "LIST" },
        { type: "Groups" as const, id },
      ],
    }),

    // DELETE /communities/:id
    deleteCommunity: builder.mutation<ICommunityResponse, string>({
      query: (id) => ({
        url: `/communities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCommunitiesQuery,
  useGetSingleCommunityQuery,
  useGetCategoriesQuery,
  useCreateCommunityMutation,
  useUpdateCommunityMutation,
  useDeleteCommunityMutation,
} = communityApi;
