"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { AnalyticsStats } from "@/components/dashboard/(admin)/analytics/AnalyticsStats";
import { UserActivity } from "@/components/dashboard/(admin)/analytics/UserActivity";
import { PopularCourses } from "@/components/dashboard/(admin)/analytics/PopularCourses";
import { TrafficSources } from "@/components/dashboard/(admin)/analytics/TrafficSources";
import { cn } from "@/lib/utils";
import { useGetAnalyticsReportsQuery } from "@/lib/redux/features/dashboard/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

const FILTERS = ["Week", "Month", "Year"];

export default function AnalyticsReportsPage() {
  const [activeFilter, setActiveFilter] = useState("Month");
  const { data: response, isLoading, isError } = useGetAnalyticsReportsQuery();

  const analytics = response?.data;

  const renderSkeleton = () => (
    <div className="space-y-8">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm space-y-6">
          <Skeleton className="h-6 w-32 mb-8" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm space-y-4">
          <Skeleton className="h-6 w-40 mb-8" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-12 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Skeleton */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm">
        <Skeleton className="h-6 w-40 mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2 flex flex-col items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Container>
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Track platform performance and user engagement"
        actions={
          <div className=" hidden items-center p-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
            {FILTERS.map((filter) => (
              <Button
                key={filter}
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-lg px-4 font-bold transition-all",
                  activeFilter === filter
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
        }
      />

      {isLoading ? (
        renderSkeleton()
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-rose-500 font-bold">Failed to load analytics data.</p>
          <Button variant="link" onClick={() => window.location.reload()}>Try Refreshing</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <AnalyticsStats stats={analytics?.stats} />

          {/* Charts & Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserActivity activity={analytics?.userActivity} />
            <PopularCourses courses={analytics?.popularCourses} />
          </div>

          {/* Traffic Sources */}
          <TrafficSources sources={analytics?.trafficSources} />
        </div>
      )}
    </Container>
  );
}
