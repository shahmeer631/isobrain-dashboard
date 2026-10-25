"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { SettingsSaveButton } from "./SettingsSaveButton";

export function BillingSettings({
  onSave,
  isSaving,
}: {
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="bg-white dark:bg-[var(--ib-dk)] rounded-3xl p-8 shadow-sm space-y-8">
      <h3 className="text-[18px] font-bold text-[var(--ib-ink)] dark:text-white mb-6">
        Billing Information
      </h3>

      <div className="space-y-8">
        {/* Tier/Plan Card */}
        <div className="p-8 rounded-2xl bg-[var(--ib-accbg)]/50 dark:bg-[var(--ib-acc)]/10 border border-[var(--ib-accbg)]/50 dark:border-[var(--ib-acc)]/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-[12px] font-bold text-[var(--ib-acc)] uppercase tracking-widest">
              Current Plan
            </p>
            <h4 className="text-2xl font-black text-[var(--ib-ink)] dark:text-white leading-none">
              Enterprise Plan
            </h4>
          </div>
          <Button className="h-11 px-8 rounded-xl font-bold bg-white dark:bg-[var(--ib-dk)] border border-[var(--ib-line)] dark:border-[var(--ib-line)] text-[var(--ib-ink)] dark:text-white hover:bg-[var(--ib-bg)] dark:hover:bg-[var(--ib-dk)] shadow-sm transition-all active:scale-95">
            Upgrade
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Billing Email
            </Label>
            <Input
              defaultValue="billing@isobrain.com"
              className="h-12 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-xl focus:ring-[var(--ib-acc)] font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Company Name
            </Label>
            <Input
              defaultValue="ISO Brain Ltd."
              className="h-12 bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-xl focus:ring-[var(--ib-acc)] font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-[var(--ib-ink)] dark:text-[var(--ib-mute)]">
              Billing Address
            </Label>
            <Textarea
              className="min-h-[120px] bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 border-[var(--ib-line)] dark:border-[var(--ib-line)] rounded-xl focus:ring-[var(--ib-acc)] font-medium resize-none p-4"
              placeholder="Enter your billing address"
            />
          </div>
        </div>

        <SettingsSaveButton onSave={onSave} isSaving={isSaving} />
      </div>
    </div>
  );
}
