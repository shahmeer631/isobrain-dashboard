"use client";

import React from "react";
import { Tag, DollarSign, Wallet, Zap } from "lucide-react";
import { DashboardStatCard } from "../../DashboardStatCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CouponStatsProps {
  stats?: {
    totalCouponUses: number;
    revenueFromCoupons: number;
    totalDiscountGiven: number;
    activeCoupons: number;
  };
  isLoading?: boolean;
}

export function CouponStats({ stats, isLoading }: CouponStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[120px] bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 animate-pulse"
          >
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const statData = [
    {
      label: "Total Coupon Uses",
      value: stats?.totalCouponUses?.toString() || "0",
      icon: Tag,
      iconColor: "bg-blue-100 text-blue-600",
    },
    {
      label: "Revenue from Coupons",
      value: `$${stats?.revenueFromCoupons?.toLocaleString() || "0"}`,
      icon: DollarSign,
      iconColor: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Total Discounts Given",
      value: `$${stats?.totalDiscountGiven?.toLocaleString() || "0"}`,
      icon: Wallet,
      iconColor: "bg-purple-100 text-purple-600",
    },
    {
      label: "Active Coupons",
      value: stats?.activeCoupons?.toString() || "0",
      icon: Zap,
      iconColor: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statData.map((stat, index) => (
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
