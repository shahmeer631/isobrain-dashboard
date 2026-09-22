"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function UserStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <Skeleton className="h-10 w-10 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContinueLearningSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="relative w-full md:w-56 h-36 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-1/2 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
                <div className="space-y-3 pt-2">
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end md:justify-center md:pl-4">
                <Skeleton className="h-12 w-40 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentResourcesSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 h-full space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40 rounded-md" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 dark:border-slate-800/50">
            <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentAchievementsSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 h-full space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48 rounded-md" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-5">
            <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
