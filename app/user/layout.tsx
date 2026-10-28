"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { OnboardingGate } from "@/components/dashboard/(user)/onboarding/OnboardingGate";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname?.startsWith("/user/onboarding");

  if (isOnboarding) {
    return <>{children}</>;
  }

  return (
    <DashboardProvider>
      <DashboardShell stats={null} enrollments={null} topCourses={null}>
        <OnboardingGate>{children}</OnboardingGate>
      </DashboardShell>
    </DashboardProvider>
  );
}
