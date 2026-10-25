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
    <div className="bg-white dark:bg-[var(--ib-dk)] rounded-3xl p-8 shadow-sm">
      <h3 className="text-[18px] font-bold text-[var(--ib-ink)] dark:text-white mb-8">
        Notification Preferences
      </h3>

      <div className="space-y-4">
        {NOTIFICATION_PREFERENCES.map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between p-6 rounded-2xl bg-[var(--ib-bg)] dark:bg-[var(--ib-dk)]/50 hover:bg-[var(--ib-bg)] dark:hover:bg-[var(--ib-dk)] transition-colors"
          >
            <div className="space-y-1">
              <Label
                htmlFor={pref.id}
                className="text-[15px] font-bold text-[var(--ib-ink)] dark:text-white cursor-pointer"
              >
                {pref.label}
              </Label>
              <p className="text-[13px] font-medium text-[var(--ib-mute)] leading-relaxed">
                {pref.description}
              </p>
            </div>
            <Switch
              id={pref.id}
              defaultChecked
              className="data-[state=checked]:bg-[var(--ib-acc)]"
            />
          </div>
        ))}

        <SettingsSaveButton onSave={onSave} isSaving={isSaving} />
      </div>
    </div>
  );
}
