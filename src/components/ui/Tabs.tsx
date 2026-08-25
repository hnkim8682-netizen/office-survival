"use client";

import { cn } from "@/lib/utils/cn";

interface TabsProps<T extends string> {
  tabs: ReadonlyArray<{ id: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
  label: string;
}

/** Segmented control. Arrow keys move between tabs, as expected of a tablist. */
export function Tabs<T extends string>({ tabs, value, onChange, className, label }: TabsProps<T>) {
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === value);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onChange(tabs[(index + 1) % tabs.length].id);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onChange(tabs[(index - 1 + tabs.length) % tabs.length].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex w-full gap-1 rounded-xl border border-border bg-surface-2 p-1 sm:w-auto",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors sm:flex-none",
              active ? "bg-surface text-fg shadow-[var(--shadow-card)]" : "text-muted hover:text-fg",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
