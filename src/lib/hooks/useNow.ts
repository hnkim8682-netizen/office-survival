"use client";

import { useSyncExternalStore } from "react";

import { getClockServerSnapshot, getClockSnapshot, subscribeToClock } from "@/lib/store/clock";

/**
 * Ticking clock. Null on the server and on the first client render, so
 * time-dependent UI never causes a hydration mismatch.
 */
export function useNow(): Date | null {
  const timestamp = useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getClockServerSnapshot,
  );

  return timestamp === 0 ? null : new Date(timestamp);
}
