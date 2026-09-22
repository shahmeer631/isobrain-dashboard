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
    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-linear-to-l from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 flex items-center justify-center shrink-0 ">
          <Share2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Share Your Achievement Profile
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Create a public profile showcasing all your ISO Brain certificates
            and achievements
          </p>
        </div>
      </div>

      <Button
        onClick={onCreateProfile}
        className="w-full md:w-auto  h-10 px-6 "
        variant="primary"
      >
        Create Public Profile
      </Button>
    </div>
  );
}
