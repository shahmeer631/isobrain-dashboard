"use client";

import { useEffect } from "react";
import "@/lib/i18n/client";
import i18n from "@/lib/i18n/client";
import {
  DEFAULT_LOCALE,
  isAppLocale,
  isRtlLocale,
  normalizeLocale,
} from "@/lib/locales";

/**
 * Applies preferredLanguage to document dir/lang and i18next.
 * Full page-copy localization is incremental; nav chrome is wired first.
 */
export default function LocaleProvider({
  children,
  preferredLanguage,
}: {
  children: React.ReactNode;
  preferredLanguage?: string | null;
}) {
  useEffect(() => {
    let lang = DEFAULT_LOCALE;
    if (preferredLanguage && isAppLocale(preferredLanguage)) {
      lang = preferredLanguage;
    } else {
      try {
        const saved = localStorage.getItem("preferredLanguage");
        if (saved) lang = normalizeLocale(saved);
      } catch {
        /* ignore */
      }
    }

    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }

    document.documentElement.lang = lang;
    document.documentElement.dir = isRtlLocale(lang) ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-locale", lang);
    try {
      localStorage.setItem("preferredLanguage", lang);
    } catch {
      /* ignore */
    }
  }, [preferredLanguage]);

  return <>{children}</>;
}
