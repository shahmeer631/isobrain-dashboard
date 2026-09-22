"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProgressStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WeeklyActivitySkeleton() {
  const heights = ["40%", "60%", "30%", "80%", "50%", "90%", "70%"];
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-8 h-80">
      <Skeleton className="h-6 w-40 rounded-md" />
      <div className="flex items-end justify-between gap-4 h-48 px-2">
        {heights.map((height, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-lg" style={{ height }} />
        ))}
      </div>
    </div>
  );
}

export function CourseProgressSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-8">
      <Skeleton className="h-6 w-48 rounded-md" />
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/2 rounded-md" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
