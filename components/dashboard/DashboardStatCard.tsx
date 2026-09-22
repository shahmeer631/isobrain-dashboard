"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardStatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Hex / Tailwind gradient pair for the icon box */
  iconColor?: string;
  /** Trend direction */
  trend?: "up" | "down";
  /** e.g. "+12.9%" */
  trendValue?: string;
  className?: string;
  isLoading?: boolean;
}

import { Skeleton } from "@/components/ui/skeleton";

/**
 * DashboardStatCard — A compact stat card matching the admin dashboard design.
 *
 * Usage:
 *   <DashboardStatCard
 *     label="Total Revenue"
 *     value="$45,231"
 *     icon={DollarSign}
 *     iconColor="from-emerald-400 to-green-500"
 *     trend="up"
 *     trendValue="+12.9%"
 *   />
 */
export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  iconColor = "from-purple-500 to-indigo-500",
  trend,
  trendValue,
  className,
  isLoading,
}: DashboardStatCardProps) {
  const isUp = trend === "up";
  const isDown = trend === "down";

  if (isLoading) {
    return (
      <div className={cn(
        "flex flex-col gap-3 rounded-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-xs",
        className
      )}>
        <div className="flex items-start justify-between">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-24 mt-2" />
        <Skeleton className="h-4 w-16 mt-1" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-xs transition-all duration-300 hover:shadow-md",
        className,
      )}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        {/* Icon box */}
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-xs",
            iconColor,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Trend badge */}
        {trend && trendValue && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              isUp &&
                "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
              isDown &&
                "text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400",
            )}
          >
            {isUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trendValue}
          </span>
        )}
      </div>

      {/* Value */}
      <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white leading-none">
        {value}
      </h3>

      {/* Label */}
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-none">
        {label}
      </p>
    </div>
  );
}
