"use client";

import { OrderStatCard } from "./OrderStatCard";

interface OrderStatsProps {
  stats?: {
    todayRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    pendingOrders: number;
  };
}

export function OrderStats({ stats }: OrderStatsProps) {
  const statConfig = [
    {
      label: "Today's Revenue",
      value: `$${stats?.todayRevenue || 0}`,
      valueColor: "text-emerald-500",
    },
    {
      label: "Total Orders",
      value: `${stats?.totalOrders || 0}`,
      valueColor: "text-blue-600",
    },
    {
      label: "Avg Order Value",
      value: `$${stats?.avgOrderValue?.toFixed(2) || 0}`,
      valueColor: "text-purple-600",
    },
    {
      label: "Pending",
      value: `${stats?.pendingOrders || 0}`,
      valueColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statConfig.map((stat, index) => (
        <OrderStatCard key={index} {...stat} />
      ))}
    </div>
  );
}
