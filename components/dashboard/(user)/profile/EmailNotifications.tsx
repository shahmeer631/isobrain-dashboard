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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Email Notifications
      </h2>
      <div className="space-y-6">
        <FormField
          control={control}
          name="courseUpdates"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800/60 p-4 shadow-sm">
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800/60 p-4 shadow-sm">
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800/60 p-4 shadow-sm">
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
