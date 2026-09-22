"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import Container from "@/components/ui/container";
import { UserStats } from "@/components/dashboard/(user)/home/UserStats";
import { ContinueLearning } from "@/components/dashboard/(user)/home/ContinueLearning";
import { RecentResources } from "@/components/dashboard/(user)/home/RecentResources";
import { RecentAchievements } from "@/components/dashboard/(user)/home/RecentAchievements";
import { useGetProfileQuery } from "@/lib/redux/features/user/userApi";
import { useGetUserDashboardQuery } from "@/lib/redux/features/user/userDashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

const UserHomePage = () => {
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetUserDashboardQuery();

  const user = profileData?.data;
  const stats = dashboardData?.data?.stats;
  const continueLearning = dashboardData?.data?.continueLearning || [];
  const recentResources = dashboardData?.data?.recentResources || [];
  const recentAchievements = dashboardData?.data?.recentAchievements || [];

  return (
    <Container>
      <div className="space-y-10 pb-10">
        {isProfileLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        ) : (
          <PageHeader
            title={`Welcome back, ${user?.firstName || "Student"}! 👋`}
            subtitle="Continue your learning journey and achieve your goals"
          />
        )}

        {/* Stats Grid */}
        <UserStats stats={stats} isLoading={isDashboardLoading} />

        {/* Continue Learning Section */}
        <ContinueLearning courses={continueLearning} isLoading={isDashboardLoading} />

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentResources resources={recentResources} isLoading={isDashboardLoading} />
          <RecentAchievements achievements={recentAchievements} isLoading={isDashboardLoading} />
        </div>
      </div>
    </Container>
  );
};

export default UserHomePage;

