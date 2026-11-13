"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales";
import { DASHBOARD_DICTIONARIES } from "./dictionaries";

const resources = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [
    locale,
    { translation: DASHBOARD_DICTIONARIES[locale] },
  ]),
);

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [...SUPPORTED_LOCALES],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;
