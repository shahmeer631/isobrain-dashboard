"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetOnboardingQuery } from "@/lib/redux/features/user/onboardingApi";

/**
 * Redirects users with incomplete Phase 1 onboarding to /user/onboarding.
 * Legacy users (onboardingCompleted === null) are not forced through the wizard.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const onOnboardingRoute = pathname?.startsWith("/user/onboarding");

  const { data, isLoading, isFetching } = useGetOnboardingQuery(undefined, {
    skip: onOnboardingRoute,
  });

  useEffect(() => {
    if (onOnboardingRoute || isLoading || isFetching) return;
    if (data?.data?.needsOnboarding) {
      router.replace("/user/onboarding");
    }
  }, [data, isLoading, isFetching, onOnboardingRoute, router]);

  if (!onOnboardingRoute && (isLoading || data?.data?.needsOnboarding)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm font-medium text-[var(--ib-mute)]">
        Preparing your workspace...
      </div>
    );
  }

  return <>{children}</>;
}
