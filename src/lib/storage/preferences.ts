import { readLocal, writeLocal } from "./local";
import { STORAGE_KEYS } from "./keys";

export interface Preferences {
  /** "HH:MM" — when the working day ends. */
  quitTime: string;
  /** "HH:MM" — when it starts, used for the progress bar. */
  startTime: string;
  /** Unpaid break in minutes, subtracted from the working day. */
  breakMinutes: number;
  /** Whether the countdown treats Sat/Sun as days off. */
  weekendOff: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  quitTime: "18:00",
  startTime: "09:00",
  breakMinutes: 60,
  weekendOff: true,
};

const EVENT = "office-survival:preferences";

/**
 * Preferences live in localStorage today. Once Firebase Auth is enabled the
 * same read/write pair can hydrate from Firestore for signed-in users — every
 * caller already goes through these two functions and the subscription below.
 */
export function getPreferences(): Preferences {
  const stored = readLocal<Partial<Preferences>>(STORAGE_KEYS.preferences, {});
  return { ...DEFAULT_PREFERENCES, ...stored };
}

export function setPreferences(patch: Partial<Preferences>): Preferences {
  const next = { ...getPreferences(), ...patch };
  writeLocal(STORAGE_KEYS.preferences, next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<Preferences>(EVENT, { detail: next }));
  }
  return next;
}

/** Notifies every mounted component when preferences change (same tab or another). */
export function subscribeToPreferences(listener: (value: Preferences) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onCustom = (event: Event) => {
    listener((event as CustomEvent<Preferences>).detail ?? getPreferences());
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.preferences) listener(getPreferences());
  };

  window.addEventListener(EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
