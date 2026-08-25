import { STORAGE_KEYS } from "@/lib/storage/keys";
import { readLocal, writeLocal } from "@/lib/storage/local";

export type Theme = "dark" | "light";

/** Runs before paint in the root layout, so the page never flashes. */
export const THEME_INIT_SCRIPT = `(function(){try{var v=localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.theme,
)});var t=v?JSON.parse(v):null;document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export function getStoredTheme(): Theme | null {
  const value = readLocal<Theme | null>(STORAGE_KEYS.theme, null);
  return value === "light" || value === "dark" ? value : null;
}

export function getActiveTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  writeLocal(STORAGE_KEYS.theme, theme);
}
