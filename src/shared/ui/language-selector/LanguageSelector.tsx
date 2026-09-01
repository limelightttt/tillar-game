import { Languages } from "lucide-react";

import { languages, useI18n } from "@/shared/config";

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="relative inline-flex min-h-11 shrink-0 items-center rounded-2xl border border-white/20 bg-white/10 pl-3 text-white shadow-sm backdrop-blur transition focus-within:ring-4 focus-within:ring-cyan/30 hover:bg-white/15">
      <Languages aria-hidden="true" className="size-4 text-cyan" />
      <span className="sr-only">{t("language.label")}</span>
      <select
        aria-label={t("language.label")}
        className="min-h-11 cursor-pointer appearance-none bg-transparent py-0 pl-2 pr-7 text-xs font-black uppercase text-white outline-none"
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
      >
        {languages.map((item) => (
          <option className="bg-ink text-white" key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 text-[0.55rem] text-white/60"
      >
        ▼
      </span>
    </label>
  );
}
