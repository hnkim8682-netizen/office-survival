export function pad2(value: number): string {
  return String(Math.floor(Math.abs(value))).padStart(2, "0");
}

export function formatNumber(value: number, locale = "ko-KR"): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrencyKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
