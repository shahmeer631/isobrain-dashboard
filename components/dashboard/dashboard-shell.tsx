"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { cn } from "@/lib/utils";

export default function DashboardShell({
  children,
  stats,
  enrollments,
  topCourses,
}: {
  children: React.ReactNode;
  stats: React.ReactNode;
  enrollments: React.ReactNode;
  topCourses: React.ReactNode;
}) {
  const { isCollapsed } = useDashboard();

  return (
    <div className="flex min-h-screen w-full bg-[var(--ib-bg)] font-sans text-[var(--ib-ink)] antialiased">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-[var(--ib-line)] bg-[var(--ib-side)] transition-all duration-300 ease-in-out min-[981px]:block",
          isCollapsed ? "w-[80px]" : "w-[240px]"
        )}
      >
        <Sidebar />
      </aside>

      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out pl-0",
          isCollapsed ? "min-[981px]:pl-[80px]" : "min-[981px]:pl-[240px]"
        )}
      >
        <Header />

        {/* HTML reference: .pg padding 32px desktop / 20px ≤980px */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--ib-bg)] p-5 [scrollbar-gutter:stable] min-[981px]:p-8">
          <div className="ib-reveal mx-auto max-w-[1280px] space-y-6 motion-reduce:animate-none">
            {children}

            {(stats || enrollments || topCourses) && (
              <div className="space-y-6">
                {stats}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {enrollments}
                  {topCourses}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
