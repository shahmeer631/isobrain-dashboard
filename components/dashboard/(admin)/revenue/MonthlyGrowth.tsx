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
        "bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 h-full",
        className,
      )}
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        Monthly Growth
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-50 dark:border-slate-800"
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {item.month}{" "}
                {item.isProjected && (
                  <span className="text-xs font-medium text-slate-400 ml-1">
                    (Projected)
                  </span>
                )}
              </p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +{item.growth}
              </p>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
