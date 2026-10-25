"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MonthlyData {
  month: string;
  amount: string;
  growth: string;
  isProjected?: boolean;
}

interface MonthlyGrowthProps {
  data: MonthlyData[];
  className?: string;
}

export function MonthlyGrowth({ data, className }: MonthlyGrowthProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[var(--ib-dk)] rounded-2xl p-6 border border-[var(--ib-line)] dark:border-[var(--ib-line)] h-full",
        className,
      )}
    >
      <h3 className="text-xl font-bold text-[var(--ib-ink)] dark:text-white mb-6">
        Monthly Growth
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl bg-[var(--ib-bg)]/50 dark:bg-[var(--ib-dk)]/50 border border-[var(--ib-line)] dark:border-[var(--ib-line)]"
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-[var(--ib-ink)] dark:text-white">
                {item.month}{" "}
                {item.isProjected && (
                  <span className="text-xs font-medium text-[var(--ib-mute)] ml-1">
                    (Projected)
                  </span>
                )}
              </p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +{item.growth}
              </p>
            </div>
            <span className="text-base font-bold text-[var(--ib-ink)] dark:text-white">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
