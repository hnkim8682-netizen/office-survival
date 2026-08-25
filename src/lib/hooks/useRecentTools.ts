"use client";

import { useSyncExternalStore } from "react";

import { useHydrated } from "@/lib/hooks/useHydrated";
import {
  getEmptyRecentToolIds,
  getRecentToolIds,
  subscribeToRecentTools,
} from "@/lib/storage/recent-tools";

export function useRecentToolIds(): { ids: string[]; hydrated: boolean } {
  const ids = useSyncExternalStore(
    subscribeToRecentTools,
    getRecentToolIds,
    getEmptyRecentToolIds,
  );

  return { ids, hydrated: useHydrated() };
}
