"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { SettingsSaveButton } from "./SettingsSaveButton";

export function SecuritySettings({
  onSave,
  isSaving,
}: {
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm space-y-10">
      <div className="space-y-6">
        <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-6">
          Security Settings
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Current Password
            </Label>
            <Input
              type="password"
              placeholder="Enter current password"
              className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              New Password
            </Label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Confirm Password
            </Label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">
            Two-Factor Authentication
          </h4>
          <p className="text-[13px] font-medium text-slate-500">
            Add an extra layer of security to your account
          </p>
        </div>
        <Button
          variant="outline"
          className="h-11 px-8 rounded-xl font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
        >
          Enable
        </Button>
      </div>

      <SettingsSaveButton onSave={onSave} isSaving={isSaving} />
    </div>
  );
}
