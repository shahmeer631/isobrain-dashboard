"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { Globe, Clock } from "lucide-react";

export function Preferences() {
  const { control } = useFormContext();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Preferences
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-400" />
                Language *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select your preferred language for the platform
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                Timezone *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full text-left">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="utc-8">
                    (UTC-08:00) Pacific Time (US & Canada)
                  </SelectItem>
                  <SelectItem value="utc-5">
                    (UTC-05:00) Eastern Time (US & Canada)
                  </SelectItem>
                  <SelectItem value="utc+0">(UTC+00:00) London</SelectItem>
                  <SelectItem value="utc+1">
                    (UTC+01:00) Paris, Berlin
                  </SelectItem>
                  <SelectItem value="utc+9">(UTC+09:00) Tokyo</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your timezone for scheduling and deadlines
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
