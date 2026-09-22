"use client";

import React from "react";
import { BookOpen, Play, CheckCircle, Clock } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";

import { IMyCourseStats } from "@/types/userDashboardTypes";
import { CourseStatsSkeleton } from "./CourseDashboardSkeleton";

interface CourseStatsProps {
  stats?: IMyCourseStats;
  isLoading?: boolean;
}

export function CourseStats({ stats, isLoading }: CourseStatsProps) {
  if (isLoading) {
    return <CourseStatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Enrolled"
        value={stats?.totalEnrolled?.toString() || "0"}
        icon={BookOpen}
        iconColor="from-blue-500/20 to-blue-600/20 text-blue-600 shadow-none border-blue-100/50"
      />
      <DashboardStatCard
        label="In Progress"
        value={stats?.inProgress?.toString() || "0"}
        icon={Play}
        iconColor="from-orange-500/20 to-orange-600/20 text-orange-600 shadow-none border-orange-100/50"
      />
      <DashboardStatCard
        label="Completed"
        value={stats?.completed?.toString() || "0"}
        icon={CheckCircle}
        iconColor="from-emerald-500/20 to-emerald-600/20 text-emerald-600 shadow-none border-emerald-100/50"
      />
      <DashboardStatCard
        label="Total Hours"
        value={stats?.totalHours || "0h"}
        icon={Clock}
        iconColor="from-purple-500/20 to-purple-600/20 text-purple-600 shadow-none border-purple-100/50"
      />
    </div>
  );
}
