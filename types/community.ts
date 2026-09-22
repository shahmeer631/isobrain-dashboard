// Re-export everything from the API so the rest of the app can import from here
export type {
  ICommunity,
  ICommunityCategory,
  ICommunityListResponse,
  ICommunityResponse,
  ICreateCommunityPayload,
  CommunityVisibilityFilter,
} from "@/lib/redux/features/community/communityApi";

// Legacy alias so existing imports like `import { Community } from "@/types/community"` still work
export type { ICommunity as Community } from "@/lib/redux/features/community/communityApi";

// Legacy type kept for CommunityCard badge logic
export type CommunityStatus = "ACTIVE" | "ARCHIVED" | "PRIVATE";

// Kept for backward compat (no longer used in communityApi.ts)
export interface RawCommunityResponse {
  success: boolean;
  data: {
    data: unknown[];
    meta: { total: number; page: number; limit: number };
  };
}
