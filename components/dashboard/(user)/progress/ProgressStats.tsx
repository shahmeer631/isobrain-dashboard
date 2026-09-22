"use client";

import React from "react";
import { TrendingUp, BookOpen, Award, Clock } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";

import { ProgressStatsSkeleton } from "./ProgressSkeleton";

interface ProgressStatsProps {
  avgProgress: number;
  activeCourses: number;
  completedCourses: number;
  totalTime: string;
  isLoading?: boolean;
}

export function ProgressStats({
  avgProgress,
  activeCourses,
  completedCourses,
  totalTime,
  isLoading,
}: ProgressStatsProps) {
  if (isLoading) {
    return <ProgressStatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Hero Stat Card */}
      <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 space-y-4 shadow-xl shadow-indigo-500/20 text-white">
        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-black tracking-tight">
            {avgProgress}%
          </p>
          <p className="text-[12px] font-bold opacity-80 uppercase tracking-wider">
            Average Progress
          </p>
        </div>
      </div>

      <DashboardStatCard
        label="Active Courses"
        value={activeCourses.toString()}
        icon={BookOpen}
        iconColor="bg-emerald-50 text-emerald-500 shadow-none border-emerald-100"
        className="rounded-3xl border-slate-100 dark:border-slate-800"
      />
      <DashboardStatCard
        label="Completed"
        value={completedCourses.toString()}
        icon={Award}
        iconColor="bg-purple-50 text-purple-500 shadow-none border-purple-100"
        className="rounded-3xl border-slate-100 dark:border-slate-800"
      />
      <DashboardStatCard
        label="Total Time"
        value={totalTime}
        icon={Clock}
        iconColor="bg-orange-50 text-orange-500 shadow-none border-orange-100"
        className="rounded-3xl border-slate-100 dark:border-slate-800"
      />
    </div>
  );
}
