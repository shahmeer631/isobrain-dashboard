"use client";

import { Mail, Eye, MousePointer2, Layout, LucideIcon } from "lucide-react";
import { DashboardStatCard } from "../../DashboardStatCard";

interface StatData {
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
}

const stats: StatData[] = [
  {
    label: "Total Emails Sent",
    value: "6,430",
    icon: Mail,
    iconColor: "from-blue-500/10 to-blue-500/10 text-blue-500 shadow-none",
  },
  {
    label: "Average Open Rate",
    value: "71.2%",
    icon: Eye,
    iconColor:
      "from-emerald-500/10 to-emerald-500/10 text-emerald-500 shadow-none",
  },
  {
    label: "Average Click Rate",
    value: "54.3%",
    icon: MousePointer2,
    iconColor:
      "from-purple-500/10 to-purple-500/10 text-purple-500 shadow-none",
  },
  {
    label: "Active Templates",
    value: "6",
    icon: Layout,
    iconColor:
      "from-orange-500/10 to-orange-500/10 text-orange-500 shadow-none",
  },
];

export function EmailAutomationStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
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
