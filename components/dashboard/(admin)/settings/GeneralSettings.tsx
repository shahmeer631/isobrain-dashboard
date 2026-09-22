"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SettingsSaveButton } from "./SettingsSaveButton";

export function GeneralSettings({
  onSave,
  isSaving,
}: {
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm space-y-8">
      <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-6">
        Platform Information
      </h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Platform Name
          </Label>
          <Input
            defaultValue="ISO Brain"
            className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Tagline
          </Label>
          <Input
            defaultValue="AI-Powered ISO Standards Training"
            className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Support Email
          </Label>
          <Input
            defaultValue="support@isobrain.com"
            className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Timezone
            </Label>
            <Select defaultValue="UTC">
              <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="EST">EST</SelectItem>
                <SelectItem value="PST">PST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Language
            </Label>
            <Select defaultValue="English">
              <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl focus:ring-indigo-500 font-medium">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SettingsSaveButton onSave={onSave} isSaving={isSaving} />
      </div>
    </div>
  );
}
