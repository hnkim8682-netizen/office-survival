"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_PREFERENCES,
  getPreferences,
  setPreferences,
  subscribeToPreferences,
  type Preferences,
} from "@/lib/storage/preferences";

/**
 * Reads preferences after mount (localStorage is unavailable during SSR) and
 * keeps every consumer in sync through the store's subscription.
 */
export function usePreferences() {
  const [preferences, setState] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(getPreferences());
    setHydrated(true);
    return subscribeToPreferences(setState);
  }, []);

  const update = useCallback((patch: Partial<Preferences>) => {
    setState(setPreferences(patch));
  }, []);

  return { preferences, update, hydrated };
}
