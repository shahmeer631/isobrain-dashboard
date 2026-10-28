"use client";

import React from "react";
import { TrendingUp, BookOpen, Award, Clock, LucideIcon } from "lucide-react";
import { ProgressStatsSkeleton } from "./ProgressSkeleton";
import { GlanceStat } from "@/components/dashboard/design-system";

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

  const cards: {
    label: string;
    value: string;
    icon: LucideIcon;
    hero?: boolean;
  }[] = [
    {
      label: "Average progress",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      hero: true,
    },
    {
      label: "Active courses",
      value: activeCourses.toString(),
      icon: BookOpen,
    },
    {
      label: "Completed",
      value: completedCourses.toString(),
      icon: Award,
    },
    {
      label: "Learning time",
      value: totalTime,
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, hero }) =>
        hero ? (
          <div
            key={label}
            className="relative overflow-hidden rounded-[14px] bg-[var(--ib-acc)] p-[18px] text-[var(--ib-on)] shadow-[0_12px_28px_-14px_color-mix(in_srgb,var(--ib-acc)_55%,transparent)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/10"
            />
            <div className="relative flex size-9 items-center justify-center rounded-xl bg-white/15">
              <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} aria-hidden />
            </div>
            <b className="relative mt-3.5 block text-[26px] font-bold leading-[1.1] tracking-[-0.02em]">
              {value}
            </b>
            <span className="relative text-[13px] opacity-90">{label}</span>
          </div>
        ) : (
          <GlanceStat key={label} label={label} value={value} icon={Icon} />
        )
      )}
    </div>
  );
}
