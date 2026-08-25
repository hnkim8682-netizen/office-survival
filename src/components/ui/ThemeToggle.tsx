"use client";

import { useEffect, useState } from "react";

import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { applyTheme, getActiveTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils/cn";

import { Icon } from "./Icon";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getActiveTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
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
      <Icon name={mounted && theme === "light" ? "moon" : "sun"} size={17} />
    </button>
  );
}
