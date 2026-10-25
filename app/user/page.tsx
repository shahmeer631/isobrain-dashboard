"use client";

import { UserStats } from "@/components/dashboard/(user)/home/UserStats";
import { ContinueLearning } from "@/components/dashboard/(user)/home/ContinueLearning";
import { RecentResources } from "@/components/dashboard/(user)/home/RecentResources";
import { RecentAchievements } from "@/components/dashboard/(user)/home/RecentAchievements";
import { MyCoursesTable } from "@/components/dashboard/(user)/home/MyCoursesTable";
import { useGetProfileQuery } from "@/lib/redux/features/user/userApi";
import {
  useGetUserDashboardQuery,
  useGetMyCoursesQuery,
} from "@/lib/redux/features/user/userDashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/dashboard/design-system";

const UserHomePage = () => {
  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfileQuery();
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetUserDashboardQuery();
  const { data: myCoursesData, isLoading: isCoursesLoading } =
    useGetMyCoursesQuery();

  const user = profileData?.data;
  const stats = dashboardData?.data?.stats;
  const continueLearning = dashboardData?.data?.continueLearning || [];
  const recentResources = dashboardData?.data?.recentResources || [];
  const recentAchievements = dashboardData?.data?.recentAchievements || [];
  const courses = myCoursesData?.data?.courses || [];

  const firstName = user?.firstName || "Student";

  return (
    <div className="pb-8">
      {isProfileLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 max-w-full rounded-lg" />
        </div>
      ) : (
        <div className="ib-reveal">
          <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--ib-acc)]">
            Overview
          </p>
          <h1 className="text-[24px] font-bold tracking-[-0.025em] text-[var(--ib-ink)] min-[981px]:text-[28px]">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-[var(--ib-mute)]">
            Continue your learning journey and achieve your goals.
          </p>
        </div>
      )}

      <div className="ib-reveal ib-reveal-delay-1 mt-[26px] grid grid-cols-1 gap-5 min-[981px]:grid-cols-[1.7fr_1fr]">
        <ContinueLearning
          courses={continueLearning}
          isLoading={isDashboardLoading}
        />
        <div>
          <SectionHeader title="Your learning at a glance" />
          <UserStats stats={stats} isLoading={isDashboardLoading} compact />
        </div>
      </div>

      <div className="ib-reveal ib-reveal-delay-2 mt-6">
        <MyCoursesTable courses={courses} isLoading={isCoursesLoading} />
      </div>

      <div className="ib-reveal ib-reveal-delay-3 mt-6 grid grid-cols-1 gap-5 min-[981px]:grid-cols-2">
        <RecentResources
          resources={recentResources}
          isLoading={isDashboardLoading}
        />
        <RecentAchievements
          achievements={recentAchievements}
          isLoading={isDashboardLoading}
        />
      </div>
    </div>
  );
};

export default UserHomePage;
