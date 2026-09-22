export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: {
      totalRevenue: number;
      totalUsers: number;
      activeCourses: number;
      newLeads: number;
    };
    recentOrders: Array<{
      id: string;
      userId: string;
      planId: string;
      couponId: string;
      originalAmount: number;
      discountAmount: number;
      finalAmount: number;
      currency: string;
      stripePaymentIntentId: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      plan: {
        id: string;
        name: string;
      };
    }>;
  };
}
export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    stats: {
      totalUsers: number;
      activeCourses: number;
      revenue: number;
      engagementRate: number;
    };
    userActivity: Array<{
      day: string;
      users: number;
    }>;
    popularCourses: Array<{
      name: string;
      students: number;
      rating: number;
    }>;
    trafficSources: Array<{
      name: string;
      value: number;
    }>;
  };
}
export interface UsageUnitsResponse {
  success: boolean;
  message: string;
  data: {
    stats: {
      totalUnitsIssued: number;
      activeSubscribers: number;
      avgUnitsUsed: number;
    };
    plans: Array<{
      id: string; // The API snippet didn't show ID but normally plans have IDs. If not, I'll use planName as key or handle it.
      planName: string;
      learningUnits: number;
      users: number;
      totalUnits: number;
      avgUsage: number;
      usageRate: number;
    }>;
  };
}

export interface UpdateUsageUnitsRequest {
  planName: string; // Or planId if available. Based on snippet, planName is what we have.
  learningUnits: number;
}

export interface ITransaction {
  id: string;
  userId: string;
  planId: string;
  couponId: string | null;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  stripePaymentIntentId: string | null;
  status: "SUCCEEDED" | "PENDING" | "FAILED" | string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
    learningUnits: number;
  };
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    stats: {
      totalRevenue: number;
      completed: number;
      pending: number;
      failed: number;
    };
    data: ITransaction[];
  };
}

