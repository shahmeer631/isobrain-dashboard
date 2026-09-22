"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const NOTIFICATION_PREFERENCES = [
  {
    id: "user-reg",
    label: "New User Registration",
    description: "Get notified when a new user signs up",
  },
  {
    id: "course-purch",
    label: "Course Purchases",
    description: "Receive alerts for new course sales",
  },
  {
    id: "review-sub",
    label: "Review Submissions",
    description: "Notifications for new course reviews",
  },
  {
    id: "system-upd",
    label: "System Updates",
    description: "Important platform updates and announcements",
  },
];

import { SettingsSaveButton } from "./SettingsSaveButton";

export function NotificationSettings({
  onSave,
  isSaving,
}: {
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm">
      <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-8">
        Notification Preferences
      </h3>

      <div className="space-y-4">
        {NOTIFICATION_PREFERENCES.map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="space-y-1">
              <Label
                htmlFor={pref.id}
                className="text-[15px] font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                {pref.label}
              </Label>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                {pref.description}
              </p>
            </div>
            <Switch
              id={pref.id}
              defaultChecked
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
        ))}

        <SettingsSaveButton onSave={onSave} isSaving={isSaving} />
      </div>
    </div>
  );
}
