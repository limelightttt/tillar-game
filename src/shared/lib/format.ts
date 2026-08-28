export function formatSeconds(milliseconds: number) {
  return `${(milliseconds / 1_000).toLocaleString("ru-RU", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} с`;
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
