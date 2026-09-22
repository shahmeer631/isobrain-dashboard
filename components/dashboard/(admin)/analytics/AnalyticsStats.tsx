"use client";

import React from "react";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";
import { DashboardStatCard } from "../../DashboardStatCard";

interface AnalyticsStatsProps {
  stats?: {
    totalUsers: number;
    activeCourses: number;
    revenue: number;
    engagementRate: number;
  };
}

export function AnalyticsStats({ stats }: AnalyticsStatsProps) {
  const ANALYTICS_STATS = [
    {
      label: "Total Users",
      value: stats?.totalUsers.toLocaleString() || "0",
      icon: Users,
      iconColor: "bg-blue-100 text-blue-500",
      trend: "up" as const,
      trendValue: "+12.5%", // These could be dynamic if API provides them
    },
    {
      label: "Active Courses",
      value: stats?.activeCourses.toString() || "0",
      icon: BookOpen,
      iconColor: "bg-emerald-100 text-emerald-500",
      trend: "up" as const,
      trendValue: "+2",
    },
    {
      label: "Revenue",
      value: `$${stats?.revenue.toLocaleString() || "0"}`,
      icon: DollarSign,
      iconColor: "bg-purple-100 text-purple-500",
      trend: "up" as const,
      trendValue: "+8.2%",
    },
    {
      label: "Engagement Rate",
      value: `${stats?.engagementRate}%` || "0%",
      icon: TrendingUp,
      iconColor: "bg-orange-100 text-orange-500",
      trend: "up" as const,
      trendValue: "+5.2%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {ANALYTICS_STATS.map((stat, index) => (
        <DashboardStatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
          trend={stat.trend}
          trendValue={stat.trendValue}
          className="rounded-xl border-none shadow-sm"
        />
      ))}
    </div>
  );
}
