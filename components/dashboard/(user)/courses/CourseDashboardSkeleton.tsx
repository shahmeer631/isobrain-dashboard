"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseStatsSkeleton() {
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

export function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Thumbnail Skeleton */}
          <Skeleton className="aspect-16/10 w-full" />
          
          <div className="p-6 space-y-5">
            <div className="space-y-3">
              {/* Category Badge */}
              <Skeleton className="h-5 w-24 rounded-md" />
              {/* Title lines */}
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-6 w-2/3 rounded-md" />
              {/* Instructor */}
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>

            {/* Progress Section */}
            <div className="space-y-3 pt-2">
              <Skeleton className="h-2.5 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>

            {/* Button Section */}
            <div className="pt-2">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
