import { type ReactNode, useEffect, useMemo, useState } from "react";

import { I18nContext, type I18nContextValue } from "./i18n-context";
import { type Language, languages, translations } from "./translations";

const STORAGE_KEY = "tillar-language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "ru";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return languages.includes(stored as Language) ? (stored as Language) : "ru";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, values) => {
        const template = translations[language][key];
        if (!values) return template;
        return Object.entries(values).reduce(
          (result, [name, replacement]) => result.replaceAll(`{${name}}`, String(replacement)),
          template,
        );
      },
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
