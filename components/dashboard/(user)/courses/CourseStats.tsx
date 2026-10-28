"use client";

import React from "react";
import { BookOpen, Play, CheckCircle, Clock, LucideIcon } from "lucide-react";
import { IMyCourseStats } from "@/types/userDashboardTypes";
import { CourseStatsSkeleton } from "./CourseDashboardSkeleton";
import { GlanceStat } from "@/components/dashboard/design-system";

interface CourseStatsProps {
  stats?: IMyCourseStats;
  isLoading?: boolean;
}

const items: {
  label: string;
  icon: LucideIcon;
  value: (s?: IMyCourseStats) => string;
}[] = [
  {
    label: "Total enrolled",
    icon: BookOpen,
    value: (s) => s?.totalEnrolled?.toString() || "0",
  },
  {
    label: "In progress",
    icon: Play,
    value: (s) => s?.inProgress?.toString() || "0",
  },
  {
    label: "Completed",
    icon: CheckCircle,
    value: (s) => s?.completed?.toString() || "0",
  },
  {
    label: "Learning time",
    icon: Clock,
    value: (s) => s?.totalHours || "0h",
  },
];

export function CourseStats({ stats, isLoading }: CourseStatsProps) {
  if (isLoading) {
    return <CourseStatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {items.map(({ label, icon, value }) => (
        <GlanceStat
          key={label}
          label={label}
          value={value(stats)}
          icon={icon}
        />
      ))}
    </div>
  );
}
