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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm space-y-8">
      <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-6">
        Billing Information
      </h3>

      <div className="space-y-8">
        {/* Tier/Plan Card */}
        <div className="p-8 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Current Plan
            </p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
              Enterprise Plan
            </h4>
          </div>
          <Button className="h-11 px-8 rounded-xl font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all active:scale-95">
            Upgrade
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Billing Email
            </Label>
            <Input
              defaultValue="billing@isobrain.com"
              className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Company Name
            </Label>
            <Input
              defaultValue="ISO Brain Ltd."
              className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Billing Address
            </Label>
            <Textarea
              className="min-h-[120px] bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium resize-none p-4"
              placeholder="Enter your billing address"
            />
          </div>
        </div>

        <SettingsSaveButton onSave={onSave} isSaving={isSaving} />
      </div>
    </div>
  );
}
