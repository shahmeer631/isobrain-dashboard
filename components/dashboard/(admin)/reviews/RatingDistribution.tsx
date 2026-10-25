"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

const DISTRIBUTION = [
  { rating: 5, percentage: 80, count: 4 },
  { rating: 4, percentage: 20, count: 1 },
  { rating: 3, percentage: 0, count: 0 },
  { rating: 2, percentage: 0, count: 0 },
  { rating: 1, percentage: 0, count: 0 },
];

export function RatingDistribution() {
  return (
    <div className="bg-white dark:bg-[var(--ib-dk)] border border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-3xl p-8 shadow-sm">
      <h3 className="text-[18px] font-bold text-[var(--ib-ink)] dark:text-white mb-6">
        Rating Distribution
      </h3>
      <div className="space-y-4">
        {DISTRIBUTION.map((item) => (
          <div key={item.rating} className="flex items-center gap-4">
            <div className="flex items-center gap-1 w-8">
              <span className="text-[14px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
                {item.rating}
              </span>
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex-1">
              <Progress
                value={item.percentage}
                className="h-2 bg-[var(--ib-bg)]"
                indicatorClassName="bg-amber-400"
              />
            </div>
            <div className="w-16 text-right">
              <span className="text-[13px] font-medium text-[var(--ib-mute)]">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
