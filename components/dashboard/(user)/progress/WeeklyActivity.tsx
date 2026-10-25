"use client";

import React from "react";
import { WeeklyActivitySkeleton } from "./ProgressSkeleton";
import { SectionHeader } from "@/components/dashboard/design-system";

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
  const activityData =
    weeklyActivity?.map((hours, index) => ({
      day: days[index] || "",
      hours,
      height: `${Math.min(hours, 100)}%`,
    })) || [];

  const weeklyGoalHours = 40;
  const currentHoursSpent =
    weeklyActivity?.reduce((acc, curr) => acc + curr, 0) || 0;

  return (
    <div className="ib-card space-y-6 p-5 sm:p-6">
      <SectionHeader title="Weekly Activity" className="mb-0" />

      <div className="relative flex h-56 items-end justify-between gap-2 px-1">
        {activityData.map((item) => (
          <div
            key={item.day}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-3"
          >
            <div className="relative flex w-full max-w-[72px] flex-1 items-end justify-center">
              <div className="pointer-events-none absolute bottom-full mb-2 rounded-md bg-[var(--ib-ink)] px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {item.hours}h
              </div>
              <div
                style={{ height: item.height }}
                className="w-full rounded-t-lg bg-[var(--ib-acc)] transition-all duration-500 group-hover:opacity-90"
              />
            </div>
            <span className="text-[12px] font-semibold text-[var(--ib-mute)] transition-colors group-hover:text-[var(--ib-ink)]">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3.5 rounded-[14px] border border-[var(--ib-line)] bg-[var(--ib-accbg)] p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ib-card)] text-[var(--ib-acc)] text-sm font-bold">
          {Math.min(100, Math.round((currentHoursSpent / weeklyGoalHours) * 100))}%
        </div>
        <p className="text-[14px] leading-relaxed text-[var(--ib-mute)]">
          <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--ib-acc)]">
            Weekly goal: {weeklyGoalHours}h
          </span>
          You&apos;ve studied{" "}
          <span className="font-semibold text-[var(--ib-ink)]">
            {currentHoursSpent} hours
          </span>{" "}
          this week. Keep going!
        </p>
      </div>
    </div>
  );
}
