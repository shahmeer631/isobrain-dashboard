import { baseApi } from "./baseApi";

export interface ApiUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  bio: string | null;
  preferredLanguage: string;
  timezone: string;
  courseUpdates: boolean;
  marketingEmails: boolean;
  weeklyProgressReport: boolean;
  isEmailVerified: boolean;
  role: string;
  status: string;
  profileImage: string | null;
  currentPlan: string;
  subscribed: string;
  totalSpent: number;
  enrollmentsCount: number;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingOverview {
  success: boolean;
  message: string;
  data: {
    currentPlan: {
      name: string;
      price: number;
      learningUnits: number;
      usedUnits: number;
      availablePoints: number;
      expiresAt: string;
      isActive: boolean;
    };
    availablePoints: number;
    orderHistory: {
      invoiceId: string;
      date: string;
      item: string;
      amount: number;
      status: string;
      paymentId: string;
    }[];
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: ApiUser[];
}

export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, void>({
      query: () => "/users",
      providesTags: ["User"],
    }),
    // getProfile lives in features/user/userApi — do not re-register here
    updateProfile: builder.mutation<
      { success: boolean; message: string; data: ApiUser },
      { id: string; body: Partial<ApiUser> }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<
      { success: boolean; message: string },
      { oldPassword?: string; newPassword?: string; password?: string }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PUT",
        body,
      }),
    }),
    deleteUser: builder.mutation<{ success: boolean; message: string; data: unknown }, string>({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    enrollUsers: builder.mutation<
      { success: boolean; message: string; data: unknown },
      { courseId: string; userIds: string[] }
    >({
      query: (body) => ({
        url: "/dashboard/admin-enroll",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    unenrollUsers: builder.mutation<
      { success: boolean; message: string; data: unknown },
      { courseId: string; userIds: string[] }
    >({
      query: (body) => ({
        url: "/dashboard/admin-unenroll",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    bulkDeleteUsers: builder.mutation<
      { success: boolean; message: string; data: unknown },
      { userIds: string[] }
    >({
      query: (body) => ({
        url: "/users/bulk-delete",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getBillingOverview: builder.query<BillingOverview, void>({
      query: () => "/user-dashboard/billing-overview",
      providesTags: ["UserDashboard"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteUserMutation,
  useEnrollUsersMutation,
  useUnenrollUsersMutation,
  useBulkDeleteUsersMutation,
  useGetBillingOverviewQuery,
} = userManagementApi;

// Re-export so existing `@/lib/redux/api/userApi` imports keep working
export {
  useGetProfileQuery,
  useLazyGetProfileQuery,
} from "../features/user/userApi";
