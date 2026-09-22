"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CategoryData {
  name: string;
  amount: string;
  percentage: number;
  color: string;
}

interface RevenueByCategoryProps {
  categories: CategoryData[];
  className?: string;
}

export function RevenueByCategory({
  categories,
  className,
}: RevenueByCategoryProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800",
        className,
      )}
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 px-1">
        Revenue by Product Category
      </h3>
      <div className="space-y-8">
        {categories.map((category, index) => (
          <div key={index} className="space-y-3 px-1">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {category.name}
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {category.amount}
              </span>
            </div>
            <div className="relative">
              <Progress
                value={category.percentage}
                className="h-[10px] bg-slate-100 dark:bg-slate-800"
                // @ts-ignore
                style={
                  {
                    "--progress-background": category.color,
                  } as React.CSSProperties
                }
              />
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                  boxShadow: `0 0 10px ${category.color}40`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
