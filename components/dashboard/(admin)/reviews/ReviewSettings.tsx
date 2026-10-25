"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ReviewSettings() {
  return (
    <div className="bg-white dark:bg-[var(--ib-dk)] border border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-3xl p-8 shadow-sm">
      <h3 className="text-[18px] font-bold text-[var(--ib-ink)] dark:text-white mb-6">
        Review Settings
      </h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Enable Course Reviews
            </Label>
            <p className="text-[13px] text-[var(--ib-mute)] font-medium">
              Allow students to leave reviews on courses
            </p>
          </div>
          <Switch
            defaultChecked
            className="data-[state=checked]:bg-[var(--ib-acc)]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Auto-approve Reviews
            </Label>
            <p className="text-[13px] text-[var(--ib-mute)] font-medium">
              Automatically approve all new reviews
            </p>
          </div>
          <Switch className="data-[state=checked]:bg-[var(--ib-acc)]" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Require Verified Purchase
            </Label>
            <p className="text-[13px] text-[var(--ib-mute)] font-medium">
              Only enrolled students can leave reviews
            </p>
          </div>
          <Switch
            defaultChecked
            className="data-[state=checked]:bg-[var(--ib-acc)]"
          />
        </div>
      </div>
    </div>
  );
}
