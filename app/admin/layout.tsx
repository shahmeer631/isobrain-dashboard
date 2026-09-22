import React from "react";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";

type AdminLayoutProps = {
  children: React.ReactNode;
  stats?: React.ReactNode;
  enrollments?: React.ReactNode;
  topCourses?: React.ReactNode;
  params?: Promise<unknown>;
};

export default function DashboardLayout({
  children,
  stats,
  enrollments,
  topCourses,
}: AdminLayoutProps) {
  return (
    <DashboardProvider>
      <DashboardShell
        stats={stats}
        enrollments={enrollments}
        topCourses={topCourses}
      >
        {children}
      </DashboardShell>
    </DashboardProvider>
  );
}
