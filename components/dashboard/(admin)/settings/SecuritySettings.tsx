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
    <div className="bg-white dark:bg-[var(--ib-dk)] rounded-3xl p-8 shadow-sm space-y-10">
      <div className="space-y-6">
        <h3 className="text-[18px] font-bold text-[var(--ib-ink)] dark:text-white mb-6">
          Security Settings
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Current Password
            </Label>
            <Input
              type="password"
              placeholder="Enter current password"
              className="h-12 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-xl focus:ring-[var(--ib-acc)] font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              New Password
            </Label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="h-12 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-xl focus:ring-[var(--ib-acc)] font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Confirm Password
            </Label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="h-12 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-xl focus:ring-[var(--ib-acc)] font-medium"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border border-[var(--ib-line)] dark:border-[var(--ib-line)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-white">
            Two-Factor Authentication
          </h4>
          <p className="text-[13px] font-medium text-[var(--ib-mute)]">
            Add an extra layer of security to your account
          </p>
        </div>
        <Button
          variant="outline"
          className="h-11 px-8 rounded-xl font-bold bg-white dark:bg-[var(--ib-dk)] border-[var(--ib-line)] dark:border-[var(--ib-line)] text-[var(--ib-ink)] dark:text-white hover:bg-[var(--ib-bg)] dark:hover:bg-[var(--ib-dk)] shadow-sm"
        >
          Enable
        </Button>
      </div>

      <SettingsSaveButton onSave={onSave} isSaving={isSaving} />
    </div>
  );
}
