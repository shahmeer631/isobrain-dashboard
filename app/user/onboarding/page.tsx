"use client";

import { OnboardingWizard } from "@/components/dashboard/(user)/onboarding/OnboardingWizard";

export default function UserOnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--ib-bg)] px-4 py-10 sm:px-6">
      <OnboardingWizard />
    </div>
  );
}
