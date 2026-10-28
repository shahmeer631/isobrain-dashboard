import { baseApi } from "../../api/baseApi";
import {
  CompleteOnboardingPayload,
  OnboardingResponse,
  SaveOnboardingPayload,
} from "@/types/onboardingTypes";

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboarding: builder.query<OnboardingResponse, void>({
      query: () => ({
        url: "/users/onboarding",
        method: "GET",
      }),
      providesTags: ["User", "UserDashboard"],
    }),
    saveOnboardingProgress: builder.mutation<
      OnboardingResponse,
      SaveOnboardingPayload
    >({
      query: (body) => ({
        url: "/users/onboarding",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User", "Personalization"],
    }),
    completeOnboarding: builder.mutation<
      OnboardingResponse,
      CompleteOnboardingPayload
    >({
      query: (body) => ({
        url: "/users/onboarding/complete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "UserDashboard", "Personalization"],
    }),

  }),
});

export const {
  useGetOnboardingQuery,
  useLazyGetOnboardingQuery,
  useSaveOnboardingProgressMutation,
  useCompleteOnboardingMutation,
} = onboardingApi;
