import React from "react";
import { BookOpen, Award, TrendingUp, Clock, Sparkles } from "lucide-react";
import { IUserDashboardStats } from "@/types/userDashboardTypes";
import { UserStatsSkeleton } from "./UserDashboardSkeleton";
import { GlanceStat } from "@/components/dashboard/design-system";
import { useGetXpSummaryQuery } from "@/lib/redux/api/xpApi";

interface UserStatsProps {
  stats?: IUserDashboardStats;
  isLoading?: boolean;
  compact?: boolean;
}

export function UserStats({ stats, isLoading, compact = true }: UserStatsProps) {
  const { data: xpData } = useGetXpSummaryQuery();
  const xpTotal = xpData?.data?.xpTotal;

  if (isLoading) {
    return <UserStatsSkeleton />;
  }

  const items = [
    {
      label: "Enrolled courses",
      value: stats?.enrolledCourses?.toString() || "0",
      icon: BookOpen,
    },
    {
      label: "Certificates earned",
      value: stats?.certificatesEarned?.toString() || "0",
      icon: Award,
    },
    {
      label: "Average progress",
      value: `${stats?.avgProgress || 0}%`,
      icon: TrendingUp,
    },
    {
      label: "Learning time",
      value: stats?.totalLearningTime || "0h",
      icon: Clock,
    },
    {
      label: "XP",
      value: typeof xpTotal === "number" ? String(xpTotal) : "0",
      icon: Sparkles,
    },
  ];

  return (
    <div
      className={
        compact
          ? "grid grid-cols-2 content-start gap-3.5"
          : "grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
      }
    >
      {items.map((item) => (
        <GlanceStat key={item.label} {...item} />
      ))}
    </div>
  );
}
