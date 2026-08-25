"use client";

import { useEffect, useState } from "react";

/**
 * Ticking clock. Returns null on the server and on the first client render so
 * time-dependent UI never causes a hydration mismatch.
 */
export function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
