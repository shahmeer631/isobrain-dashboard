import { baseApi } from "./baseApi";

export type ActivitySource = "ACADEMY" | "LIBRARY" | "AI_TOOL";

export type ActivityResume = {
  source: ActivitySource;
  courseId?: string | null;
  lessonId?: string | null;
  isoStandardId?: string | null;
  documentId?: string | null;
  aiToolId?: string | null;
  resourceLabel?: string | null;
  path?: string | null;
  activitySessionId?: string | null;
  updatedAt?: string;
};

export type ActivityHistoryItem = {
  sessionId: string;
  clientSessionId: string;
  source: ActivitySource;
  status: string;
  courseId?: string | null;
  lessonId?: string | null;
  isoStandardId?: string | null;
  documentId?: string | null;
  aiToolId?: string | null;
  resourceLabel?: string | null;
  path?: string | null;
  startedAt: string;
  lastSeenAt: string;
  activeSeconds: number;
};

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityResume: builder.query<
      { success: boolean; data: { resume: ActivityResume | null } },
      void
    >({
      query: () => ({
        url: "/activity/resume",
        method: "GET",
      }),
    }),
    getActivityHistory: builder.query<
      {
        success: boolean;
        meta?: { page: number; limit: number; total: number };
        data: ActivityHistoryItem[];
      },
      { page?: number; limit?: number; source?: ActivitySource } | void
    >({
      query: (params) => ({
        url: "/activity/history",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 8,
          ...(params?.source ? { source: params.source } : {}),
        },
      }),
    }),
  }),
});

export const { useGetActivityResumeQuery, useGetActivityHistoryQuery } =
  activityApi;
