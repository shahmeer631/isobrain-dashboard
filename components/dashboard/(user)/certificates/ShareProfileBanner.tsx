import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareProfileBannerProps {
  onCreateProfile: () => void;
}

export function ShareProfileBanner({
  onCreateProfile,
}: ShareProfileBannerProps) {
  return (
    <div className="bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-[14px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-[var(--ib-acc)] text-white shadow-lg flex items-center justify-center shrink-0 ">
          <Share2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--ib-ink)] dark:text-white">
            Share Your Achievement Profile
          </h3>
          <p className="text-xs text-[var(--ib-mute)] font-medium">
            Create a public profile showcasing all your ISO Brain certificates
            and achievements
          </p>
        </div>
      </div>

      <Button
        onClick={onCreateProfile}
        className="w-full md:w-auto h-10 px-6 "
        variant="primary"
      >
        Create Public Profile
      </Button>
    </div>
  );
}
