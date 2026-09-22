"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function UserCertificateStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm min-h-[140px] space-y-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-16 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function UserCertificateCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[220px]">
      {/* Left Banner Skeleton */}
      <Skeleton className="w-full md:w-72 h-full min-h-[220px] shrink-0" />
      
      {/* Right Content Skeleton */}
      <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>
        </div>
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          <Skeleton className="h-10 w-40 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
