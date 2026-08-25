import { readLocal, writeLocal } from "./local";
import { STORAGE_KEYS } from "./keys";

const MAX_RECENT = 8;
const EVENT = "office-survival:recent-tools";

export function getRecentToolIds(): string[] {
  const stored = readLocal<unknown>(STORAGE_KEYS.recentTools, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter((id): id is string => typeof id === "string").slice(0, MAX_RECENT);
}

export function recordToolUsage(toolId: string): string[] {
  const next = [toolId, ...getRecentToolIds().filter((id) => id !== toolId)].slice(0, MAX_RECENT);
  writeLocal(STORAGE_KEYS.recentTools, next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<string[]>(EVENT, { detail: next }));
  }
  return next;
}

export function clearRecentTools(): void {
  writeLocal(STORAGE_KEYS.recentTools, []);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<string[]>(EVENT, { detail: [] }));
  }
}

export function subscribeToRecentTools(listener: (ids: string[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onCustom = (event: Event) => listener((event as CustomEvent<string[]>).detail ?? []);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.recentTools) listener(getRecentToolIds());
  };

  window.addEventListener(EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
