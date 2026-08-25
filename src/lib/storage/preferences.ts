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

type Listener = () => void;

const listeners = new Set<Listener>();
/** Cached so getPreferences() is referentially stable for useSyncExternalStore. */
let snapshot: Preferences = DEFAULT_PREFERENCES;
let loaded = false;

function load(): Preferences {
  const stored = readLocal<Partial<Preferences>>(STORAGE_KEYS.preferences, {});
  return { ...DEFAULT_PREFERENCES, ...stored };
}

function emit() {
  listeners.forEach((listener) => listener());
}

/**
 * Preferences live in localStorage today. Once Firebase Auth is enabled the
 * same load/save pair can hydrate from Firestore for signed-in users — every
 * caller already goes through this store.
 */
export function getPreferences(): Preferences {
  return snapshot;
}

export function getDefaultPreferences(): Preferences {
  return DEFAULT_PREFERENCES;
}

export function setPreferences(patch: Partial<Preferences>): Preferences {
  snapshot = { ...snapshot, ...patch };
  writeLocal(STORAGE_KEYS.preferences, snapshot);
  emit();
  return snapshot;
}

/** Notifies every subscriber when preferences change, in this tab or another. */
export function subscribeToPreferences(listener: Listener): () => void {
  if (listeners.size === 0) {
    // First subscriber: read storage and pick up cross-tab writes.
    if (!loaded) {
      snapshot = load();
      loaded = true;
    }
    window.addEventListener("storage", onStorage);
  }

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEYS.preferences) return;
  snapshot = load();
  emit();
}
