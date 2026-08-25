"use client";

import { useCallback, useSyncExternalStore } from "react";

import { useHydrated } from "@/lib/hooks/useHydrated";
import {
  getDefaultPreferences,
  getPreferences,
  setPreferences,
  subscribeToPreferences,
  type Preferences,
} from "@/lib/storage/preferences";

/**
 * Reads preferences from the store (localStorage-backed) and keeps every
 * consumer in sync. `hydrated` is false until the browser values are in play.
 */
export function usePreferences() {
  const preferences = useSyncExternalStore(
    subscribeToPreferences,
    getPreferences,
    getDefaultPreferences,
  );
  const hydrated = useHydrated();

  const update = useCallback((patch: Partial<Preferences>) => {
    setPreferences(patch);
  }, []);

  return { preferences, update, hydrated };
}
