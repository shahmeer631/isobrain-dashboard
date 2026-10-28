import { baseApi } from "./baseApi";

export type XpLedgerItem = {
  id: string;
  eventType: string;
  amount: number;
  eventKey: string;
  sourceType?: string | null;
  sourceId?: string | null;
  createdAt: string;
};

export type XpSummary = {
  xpTotal: number;
  recent: Array<{
    id: string;
    eventType: string;
    amount: number;
    eventKey: string;
    createdAt: string;
  }>;
};

export type MilestoneItem = {
  key: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  completedAt: string | null;
  rewardXp: number;
};

export const xpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getXpSummary: builder.query<
      { success: boolean; data: XpSummary },
      void
    >({
      query: () => ({ url: "/xp/me", method: "GET" }),
    }),
    getXpHistory: builder.query<
      {
        success: boolean;
        meta?: { page: number; limit: number; total: number };
        data: XpLedgerItem[];
      },
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/xp/history",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
    }),
    getXpMilestones: builder.query<
      { success: boolean; data: MilestoneItem[] },
      void
    >({
      query: () => ({ url: "/xp/milestones", method: "GET" }),
    }),
  }),
});

export const {
  useGetXpSummaryQuery,
  useGetXpHistoryQuery,
  useGetXpMilestonesQuery,
} = xpApi;
