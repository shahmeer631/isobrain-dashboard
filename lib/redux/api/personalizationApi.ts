import { baseApi } from "./baseApi";

export type PersonalizedCourse = {
  courseId: string;
  title: string;
  slug?: string;
  thumbnail?: string | null;
  instructor?: string | null;
  categoryId?: string;
  categoryName?: string | null;
  score?: number;
  reasons?: string[];
  explanation: string;
  enrolled?: boolean;
  progress?: number;
  matchedStandardId?: string;
  nextLesson?: string | null;
  totalLessons?: number;
  completedLessons?: number;
};

export type PersonalizationOverview = {
  profile: {
    firstName?: string | null;
    industry?: string | null;
    professionalRole?: string | null;
    targetStandardIds: string[];
    targetStandards: Array<{
      id: string;
      title: string;
      categoryId: string;
      categoryName?: string | null;
    }>;
    onboardingCompleted: boolean;
    onboardingCompletedAt?: string | null;
  };
  focusSummary: string;
  resume: {
    source?: string;
    courseId?: string | null;
    lessonId?: string | null;
    path?: string | null;
    resourceLabel?: string | null;
    updatedAt?: string;
  } | null;
  continueLearning: PersonalizedCourse[];
  recommendations: {
    forYou: PersonalizedCourse[];
    forRole: PersonalizedCourse[];
    forIndustry: PersonalizedCourse[];
    targetStandards: PersonalizedCourse[];
    explore: PersonalizedCourse[];
    nextStep: PersonalizedCourse | null;
  };
  learningPath: {
    current: PersonalizedCourse | null;
    nextRecommended: PersonalizedCourse | null;
    targetAligned: PersonalizedCourse[];
    explore: PersonalizedCourse[];
  };
};

export const personalizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalizationOverview: builder.query<
      { success: boolean; data: PersonalizationOverview },
      void
    >({
      query: () => ({ url: "/personalization/overview", method: "GET" }),
      providesTags: ["Personalization"],
    }),
  }),
});

export const { useGetPersonalizationOverviewQuery } = personalizationApi;
