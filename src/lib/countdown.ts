import type { Preferences } from "@/lib/storage/preferences";
import { addDays, isWeekend } from "@/lib/utils/date";
import { atTimeOfDay, parseHourMinute } from "@/lib/utils/time";
import { clamp } from "@/lib/utils/format";

export type CountdownState = "dayOff" | "beforeWork" | "working" | "done";

export interface CountdownSnapshot {
  state: CountdownState;
  startAt: Date;
  quitAt: Date;
  /** Milliseconds until quitting time (0 once the day is over). */
  remainingMs: number;
  /** 0–1 progress through the working day. */
  progress: number;
  /** Minutes of work already done today, break excluded. */
  workedMinutes: number;
  /** Total scheduled working minutes, break excluded. */
  totalWorkMinutes: number;
}

const FALLBACK = { hours: 18, minutes: 0 };

/**
 * Pure countdown math — no clock, no storage — so both the hero widget and the
 * full page render from the same rules and it stays trivially testable.
 */
export function computeCountdown(now: Date, preferences: Preferences): CountdownSnapshot {
  const start = parseHourMinute(preferences.startTime) ?? { hours: 9, minutes: 0 };
  const quit = parseHourMinute(preferences.quitTime) ?? FALLBACK;

  const startAt = atTimeOfDay(now, start);
  let quitAt = atTimeOfDay(now, quit);
  // Night shifts: a quitting time at or before the start belongs to tomorrow.
  if (quitAt <= startAt) quitAt = addDays(quitAt, 1);

  const spanMs = quitAt.getTime() - startAt.getTime();
  const breakMinutes = Math.max(0, preferences.breakMinutes);
  const breakMs = breakMinutes * 60_000;
  const totalWorkMinutes = Math.max(0, Math.round((spanMs - breakMs) / 60_000));

  const elapsedMs = now.getTime() - startAt.getTime();
  const progress = spanMs > 0 ? clamp(elapsedMs / spanMs, 0, 1) : 1;
  const remainingMs = Math.max(0, quitAt.getTime() - now.getTime());
  const workedMinutes = clamp(
    Math.round(elapsedMs / 60_000) - breakMinutes,
    0,
    totalWorkMinutes,
  );

  let state: CountdownState;
  if (preferences.weekendOff && isWeekend(now)) state = "dayOff";
  else if (now >= quitAt) state = "done";
  else if (now < startAt) state = "beforeWork";
  else state = "working";

  return { state, startAt, quitAt, remainingMs, progress, workedMinutes, totalWorkMinutes };
}

export const COUNTDOWN_MESSAGES: Record<CountdownState, string> = {
  dayOff: "🎉 오늘은 쉬는 날입니다.",
  beforeWork: "아직 근무 시작 전입니다.",
  working: "퇴근까지",
  done: "🎉 퇴근하셨습니다.",
};
