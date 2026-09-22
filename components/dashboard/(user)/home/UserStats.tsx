import React from "react";
import { BookOpen, Award, TrendingUp, Clock } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { IUserDashboardStats } from "@/types/userDashboardTypes";
import { UserStatsSkeleton } from "./UserDashboardSkeleton";

interface UserStatsProps {
  stats?: IUserDashboardStats;
  isLoading?: boolean;
}

export function UserStats({ stats, isLoading }: UserStatsProps) {
  if (isLoading) {
    return <UserStatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Enrolled Courses"
        value={stats?.enrolledCourses?.toString() || "0"}
        icon={BookOpen}
        iconColor="from-blue-500/20 to-blue-600/20 text-blue-600 shadow-none border-blue-100/50"
        className="rounded-2xl"
      />
      <DashboardStatCard
        label="Certificates Earned"
        value={stats?.certificatesEarned?.toString() || "0"}
        icon={Award}
        iconColor="from-emerald-500/20 to-emerald-600/20 text-emerald-600 shadow-none border-emerald-100/50"
        className="rounded-2xl"
      />
      <DashboardStatCard
        label="Average Progress"
        value={`${stats?.avgProgress || 0}%`}
        icon={TrendingUp}
        iconColor="from-purple-500/20 to-purple-600/20 text-purple-600 shadow-none border-purple-100/50"
        className="rounded-2xl"
      />
      <DashboardStatCard
        label="Total Learning Time"
        value={stats?.totalLearningTime || "0h"}
        icon={Clock}
        iconColor="from-orange-500/20 to-orange-600/20 text-orange-600 shadow-none border-orange-100/50"
        className="rounded-2xl"
      />
    </div>
  );
}
