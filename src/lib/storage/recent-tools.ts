import { readLocal, writeLocal } from "./local";
import { STORAGE_KEYS } from "./keys";

const MAX_RECENT = 8;

type Listener = () => void;

const listeners = new Set<Listener>();
const EMPTY: string[] = [];
let snapshot: string[] = EMPTY;
let loaded = false;

function load(): string[] {
  const stored = readLocal<unknown>(STORAGE_KEYS.recentTools, []);
  if (!Array.isArray(stored)) return EMPTY;
  const ids = stored.filter((id): id is string => typeof id === "string").slice(0, MAX_RECENT);
  return ids.length === 0 ? EMPTY : ids;
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function getRecentToolIds(): string[] {
  return snapshot;
}

export function getEmptyRecentToolIds(): string[] {
  return EMPTY;
}

export function recordToolUsage(toolId: string): string[] {
  if (!loaded) {
    snapshot = load();
    loaded = true;
  }
  snapshot = [toolId, ...snapshot.filter((id) => id !== toolId)].slice(0, MAX_RECENT);
  writeLocal(STORAGE_KEYS.recentTools, snapshot);
  emit();
  return snapshot;
}

export function subscribeToRecentTools(listener: Listener): () => void {
  if (listeners.size === 0) {
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
  if (event.key !== STORAGE_KEYS.recentTools) return;
  snapshot = load();
  emit();
}
