"use client";

import React from "react";
import { Star, MessageSquare, CheckCircle, Percent } from "lucide-react";
import { DashboardStatCard } from "../../DashboardStatCard";

const REVIEW_STATS = [
  {
    label: "Average Rating",
    value: "4.8",
    icon: Star,
    iconColor: "bg-amber-100 text-amber-500",
  },
  {
    label: "Total Reviews",
    value: "5",
    icon: MessageSquare,
    iconColor: "bg-blue-100 text-blue-500",
  },
  {
    label: "5-Star Reviews",
    value: "4",
    icon: CheckCircle,
    iconColor: "bg-emerald-100 text-emerald-500",
  },
  {
    label: "5-Star Rate",
    value: "80%",
    icon: Percent,
    iconColor: "bg-purple-100 text-purple-500",
  },
];

export function ReviewStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {REVIEW_STATS.map((stat, index) => (
        <DashboardStatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
