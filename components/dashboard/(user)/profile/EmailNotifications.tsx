"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

export function EmailNotifications() {
  const { control } = useFormContext();

  return (
    <div className="ib-card p-6 sm:p-7">
      <div className="mb-6">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
          Email Notifications
        </h2>
        <p className="mt-1 text-[13px] text-[var(--ib-mute)]">
          Control which learning updates you receive by email.
        </p>
      </div>
      <div className="space-y-3">
        <FormField
          control={control}
          name="courseUpdates"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-[12px] border border-[var(--ib-line)] bg-[var(--ib-bg)]/50 p-4 transition-colors hover:border-[color-mix(in_srgb,var(--ib-acc)_22%,var(--ib-line))]">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">
                  Course Updates
                </FormLabel>
                <FormDescription>
                  Receive notifications about new lessons and course content
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="marketingEmails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-[12px] border border-[var(--ib-line)] bg-[var(--ib-bg)]/50 p-4 transition-colors hover:border-[color-mix(in_srgb,var(--ib-acc)_22%,var(--ib-line))]">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">
                  Marketing Emails
                </FormLabel>
                <FormDescription>
                  Receive updates about new courses and special offers
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="weeklyProgress"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-[12px] border border-[var(--ib-line)] bg-[var(--ib-bg)]/50 p-4 transition-colors hover:border-[color-mix(in_srgb,var(--ib-acc)_22%,var(--ib-line))]">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">
                  Weekly Progress Reports
                </FormLabel>
                <FormDescription>
                  Get a weekly summary of your learning progress
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
