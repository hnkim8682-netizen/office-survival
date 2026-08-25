"use client";

import { useState } from "react";

import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { applyTheme, getActiveTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils/cn";

import { Icon } from "./Icon";

export function ThemeToggle({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const [override, setOverride] = useState<Theme | null>(null);
  // Before hydration we cannot read the DOM attribute the theme script set.
  const theme: Theme = override ?? (hydrated ? getActiveTheme() : "dark");

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setOverride(next);
    applyTheme(next);
    track(ANALYTICS_EVENTS.themeChange, { theme: next });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted",
        "transition-colors hover:border-border-strong hover:text-fg",
        className,
      )}
    >
      {/* Render the dark icon until mounted so SSR and client markup agree. */}
      <Icon name={hydrated && theme === "light" ? "moon" : "sun"} size={17} />
    </button>
  );
}
