import { pad2 } from "./format";

export const MS_PER_MINUTE = 60_000;
export const MS_PER_HOUR = 3_600_000;

export type HourMinute = { hours: number; minutes: number };

/** Parses "HH:MM" (24h). Returns null when malformed or out of range. */
export function parseHourMinute(value: string): HourMinute | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

export function formatHourMinute({ hours, minutes }: HourMinute): string {
  return `${pad2(hours)}:${pad2(minutes)}`;
}

/** Splits a positive duration into clock parts. */
export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    totalSeconds: total,
  };
}

/** "02:37:41" — hours are not capped at 24. */
export function formatDuration(ms: number): string {
  const { hours, minutes, seconds } = splitDuration(ms);
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

/** Minutes since midnight -> "H시간 M분" */
export function formatMinutesKorean(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(Math.round(totalMinutes));
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  if (hours === 0) return `${sign}${minutes}분`;
  if (minutes === 0) return `${sign}${hours}시간`;
  return `${sign}${hours}시간 ${minutes}분`;
}

/** Today's date with a given wall-clock time applied (local timezone). */
export function atTimeOfDay(base: Date, { hours, minutes }: HourMinute): Date {
  const next = new Date(base);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

export function resolveTimeZone(fallback = "Asia/Seoul"): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || fallback;
  } catch {
    return fallback;
  }
}
