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
        "bg-white dark:bg-[var(--ib-dk)] rounded-2xl p-6 border border-[var(--ib-line)] dark:border-[var(--ib-line)]",
        className,
      )}
    >
      <h3 className="text-xl font-bold text-[var(--ib-ink)] dark:text-white mb-8 px-1">
        Revenue by Product Category
      </h3>
      <div className="space-y-8">
        {categories.map((category, index) => (
          <div key={index} className="space-y-3 px-1">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
                {category.name}
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {category.amount}
              </span>
            </div>
            <div className="relative">
              <Progress
                value={category.percentage}
                className="h-[10px] bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]"
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
