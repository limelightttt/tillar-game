export function formatSeconds(milliseconds: number, language: "en" | "ru" | "uz" = "ru") {
  const locale = language === "en" ? "en-US" : language === "uz" ? "uz-UZ" : "ru-RU";
  const unit = language === "en" ? "s" : language === "uz" ? "son" : "с";

  return `${(milliseconds / 1_000).toLocaleString(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} ${unit}`;
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
