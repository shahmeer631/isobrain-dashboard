"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ReviewSettings() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
      <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-6">
        Review Settings
      </h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-[15px] font-bold text-slate-800 dark:text-slate-200">
              Enable Course Reviews
            </Label>
            <p className="text-[13px] text-slate-500 font-medium">
              Allow students to leave reviews on courses
            </p>
          </div>
          <Switch
            defaultChecked
            className="data-[state=checked]:bg-indigo-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-[15px] font-bold text-slate-800 dark:text-slate-200">
              Auto-approve Reviews
            </Label>
            <p className="text-[13px] text-slate-500 font-medium">
              Automatically approve all new reviews
            </p>
          </div>
          <Switch className="data-[state=checked]:bg-indigo-600" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-[15px] font-bold text-slate-800 dark:text-slate-200">
              Require Verified Purchase
            </Label>
            <p className="text-[13px] text-slate-500 font-medium">
              Only enrolled students can leave reviews
            </p>
          </div>
          <Switch
            defaultChecked
            className="data-[state=checked]:bg-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}
