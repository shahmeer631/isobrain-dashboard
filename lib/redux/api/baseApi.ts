import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { toast } from "sonner";

const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL || "https://api.isobrain.ai/api/v1",
  prepareHeaders: (headers, { getState }) => {
    // We can also extract the token directly from cookies if preferred,
    // but Redux state is standard for RTK Query headers.
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  
  if (result.error) {
    console.log("API Error Intercepted (HTTP Error):", result.error);
    if (result.error.status === 401) {
      api.dispatch({ type: "auth/logout" });
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } else if (result.error.status === 403) {
      const errorData = result.error.data as any;
      const errorMessage = errorData?.message || "";
      if (
        errorMessage.toLowerCase().includes("course access") || 
        errorMessage.toLowerCase().includes("upgrade")
      ) {
        if (typeof window !== "undefined") {
          toast.error(errorMessage || "Your plan does not include course access. Please upgrade.", {
            id: "course-access-error",
            duration: 5000,
          });
        }
      }
    }
  } else if (result.data) {
    const responseData = result.data as any;
    if (responseData.success === false) {
      console.log("API Error Intercepted (HTTP 200 with success: false):", responseData);
      const errorMessage = responseData.message || "";
      if (
        errorMessage.toLowerCase().includes("course access") || 
        errorMessage.toLowerCase().includes("upgrade") ||
        responseData.err?.statusCode === 403
      ) {
        if (typeof window !== "undefined") {
          toast.error(errorMessage || "Your plan does not include course access. Please upgrade.", {
            id: "course-access-error",
            duration: 5000,
          });
        }
      }
    }
  }
  
  return result;
};

// Create our base API instance
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  // Define tag types for caching and invalidation
  tagTypes: [
    "User",
    "Auth",
    "Courses",
    "Bundles",
    "Videos",
    "Categories",
    "Documents",
    "Groups",
    "ISOStandards",
    "Coupons",
    "Affiliates",
    "Orders",
    "Dashboard",
    "Plans",
    "Certificates",
    "UserDashboard",
  ],
  endpoints: () => ({}),
});
