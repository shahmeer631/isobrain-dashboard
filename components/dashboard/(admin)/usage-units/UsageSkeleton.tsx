import React from "react";
import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export const UsageSkeleton = () => {
  return (
    <Container>
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 pb-12 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-xl border border-slate-100 flex flex-col gap-5">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-32 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md opacity-60" />
              </div>
            </div>
          ))}
        </div>

        {/* Plans Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-xl border border-slate-100 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-4 w-10 rounded-sm" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-sm opacity-50" />
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-50">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-24 rounded-sm" />
                    <Skeleton className="h-4 w-12 rounded-sm" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Info Box Skeleton */}
        <Skeleton className="h-40 w-full rounded-xl opacity-30" />
      </div>
    </Container>
  );
};
