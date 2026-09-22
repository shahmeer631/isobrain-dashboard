"use client";

import React from "react";

import { WeeklyActivitySkeleton } from "./ProgressSkeleton";

interface WeeklyActivityProps {
  weeklyActivity?: number[];
  isLoading?: boolean;
}

export function WeeklyActivity({
  weeklyActivity,
  isLoading,
}: WeeklyActivityProps) {
  if (isLoading) {
    return <WeeklyActivitySkeleton />;
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activityData = weeklyActivity?.map((hours, index) => ({
    day: days[index] || "",
    hours,
    height: `${Math.min(hours, 100)}%`, // Ensuring it doesn't exceed 100% for visual consistency
  })) || [];

  const weeklyGoalHours = 40;
  const currentHoursSpent = weeklyActivity?.reduce((acc, curr) => acc + curr, 0) || 0;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-8 shadow-sm">
      <h3 className="text-[18px] font-black text-slate-900 dark:text-white">
        Weekly Activity
      </h3>

      <div className="relative h-64 flex items-end justify-between gap-2 px-2">
        {activityData.map((item) => (
          <div
            key={item.day}
            className="flex-1 h-full flex flex-col items-center justify-end gap-4 group"
          >
            <div className="relative w-full max-w-[90px] flex-1 flex items-end justify-center">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md pointer-events-none">
                {item.hours}h
              </div>
              {/* Bar */}
              <div
                style={{ height: item.height }}
                className="w-full bg-linear-to-t from-indigo-600 via-indigo-500 to-purple-400 rounded-t-lg transition-all duration-500 group-hover:from-indigo-500 group-hover:to-purple-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-indigo-500/20"
              />
            </div>
            <span className="text-[12px] font-bold text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      {/* Goal Indicator */}
      <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-5 flex items-center gap-4 border border-blue-100/50 dark:border-blue-800/50">
        <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-lg">
          🎯
        </div>
        <p className="text-[14px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
          <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider text-[11px] block mb-0.5">
            Weekly Goal: {weeklyGoalHours}h
          </span>
          You&apos;ve studied{" "}
          <span className="text-slate-900 dark:text-white font-black">
            {currentHoursSpent} hours
          </span>{" "}
          this week! Keep up the great work!
        </p>
      </div>
    </div>
  );
}
