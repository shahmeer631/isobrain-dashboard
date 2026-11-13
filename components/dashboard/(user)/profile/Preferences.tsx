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
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n/client";
import { isAppLocale, isRtlLocale, type AppLocale } from "@/lib/locales";
import "@/lib/i18n/client";

export function Preferences() {
  const { control } = useFormContext();
  const { t } = useTranslation();

  const applyLanguage = (code: string) => {
    if (!isAppLocale(code)) return;
    const lang = code as AppLocale;
    void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtlLocale(lang) ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-locale", lang);
    try {
      localStorage.setItem("preferredLanguage", lang);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="ib-card p-6 sm:p-7">
      <div className="mb-6">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--ib-ink)]">
          Preferences
        </h2>
        <p className="mt-1 text-[13px] text-[var(--ib-mute)]">
          Choose language and timezone for your learning experience.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <FormField
          control={control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[var(--ib-mute)]" />
                {t("prefs.language")} *
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  applyLanguage(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t("prefs.languageHelp")}
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
                <Clock className="h-4 w-4 text-[var(--ib-mute)]" />
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
