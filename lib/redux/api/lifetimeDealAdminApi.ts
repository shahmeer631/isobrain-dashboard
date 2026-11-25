import { baseApi } from "./baseApi";

export type AdminPromotionView = {
  promotionId: string;
  name: string;
  isEnabled: boolean;
  status: "SCHEDULED" | "ACTIVE" | "EXPIRED" | "DISABLED";
  isPurchasable: boolean;
  pricingMode: "LIFETIME" | "ANNUAL";
  startsAt: string;
  endsAt: string;
  serverTime: string;
  remainingMs: number;
  currency: string;
  prices: { plus: number; pro: number; ultra: number };
  standardAnnualPrices: { plus: number; pro: number; ultra: number };
  canManageSchedule: boolean;
  canAlterPrices: boolean;
};

export type AdminLifetimePurchaseRow = {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  tier: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  purchasedAt: string | null;
  stripeReference: string | null;
  entitlementStatus: "ACTIVE" | "PENDING" | "INACTIVE" | "NONE";
  entitlementActivatedAt: string | null;
  createdAt: string;
};

export type AdminUpdateScheduleBody = {
  promotionId?: string;
  name?: string;
  isEnabled: boolean;
  startsAt: string;
  endsAt: string;
};

export const lifetimeDealAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLtdAdminConfig: builder.query<
      { success: boolean; data: AdminPromotionView },
      void | { promotionId?: string }
    >({
      query: (arg) => {
        const promotionId =
          arg && typeof arg === "object" ? arg.promotionId : undefined;
        return promotionId
          ? `/lifetime-deal/admin/config/${encodeURIComponent(promotionId)}`
          : "/lifetime-deal/admin/config";
      },
      providesTags: ["LifetimeDealAdmin"],
    }),
    updateLtdAdminSchedule: builder.mutation<
      { success: boolean; data: AdminPromotionView },
      AdminUpdateScheduleBody
    >({
      query: (body) => ({
        url: "/lifetime-deal/admin/config",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LifetimeDealAdmin"],
    }),
    getLtdAdminPurchases: builder.query<
      {
        success: boolean;
        data: {
          total: number;
          limit: number;
          offset: number;
          purchases: AdminLifetimePurchaseRow[];
        };
      },
      { status?: string; tier?: string; limit?: number; offset?: number } | void
    >({
      query: (arg) => {
        const params = new URLSearchParams();
        if (arg && typeof arg === "object") {
          if (arg.status) params.set("status", arg.status);
          if (arg.tier) params.set("tier", arg.tier);
          if (arg.limit != null) params.set("limit", String(arg.limit));
          if (arg.offset != null) params.set("offset", String(arg.offset));
        }
        const qs = params.toString();
        return qs
          ? `/lifetime-deal/admin/purchases?${qs}`
          : "/lifetime-deal/admin/purchases";
      },
      providesTags: ["LifetimeDealAdmin"],
    }),
    getLtdAdminAudit: builder.query<
      {
        success: boolean;
        data: {
          logs: Array<{
            id: string;
            adminUserId: string;
            adminEmail: string | null;
            action: string;
            before: unknown;
            after: unknown;
            createdAt: string;
          }>;
        };
      },
      void
    >({
      query: () => "/lifetime-deal/admin/audit",
      providesTags: ["LifetimeDealAdmin"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetLtdAdminConfigQuery,
  useUpdateLtdAdminScheduleMutation,
  useGetLtdAdminPurchasesQuery,
  useGetLtdAdminAuditQuery,
} = lifetimeDealAdminApi;
