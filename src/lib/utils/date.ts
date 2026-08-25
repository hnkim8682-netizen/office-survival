export const MS_PER_DAY = 86_400_000;

/** Local-date key (YYYY-MM-DD), free of timezone drift from toISOString(). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Midnight of the given date in local time. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  // Clamp (e.g. Jan 31 + 1 month -> Feb 28/29)
  next.setDate(Math.min(day, daysInMonth(next.getFullYear(), next.getMonth())));
  return next;
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Whole days between two dates, ignoring the time component. */
export function diffInDays(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

/** Weekdays (Mon–Fri) between two dates, inclusive of both ends. */
export function countWeekdays(from: Date, to: Date): number {
  let start = startOfDay(from);
  let end = startOfDay(to);
  if (start > end) [start, end] = [end, start];

  let count = 0;
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count += 1;
  }
  return count;
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function weekdayLabel(date: Date): string {
  return WEEKDAY_LABELS[date.getDay()];
}

export function formatDateKorean(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdayLabel(date)})`;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
