import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface ResultRowProps {
  label: string;
  value: ReactNode;
  hint?: string;
  emphasis?: boolean;
}

/** Shared label/value row used by the date, time and counter tools. */
export function ResultRow({ label, value, hint, emphasis }: ResultRowProps) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-0",
        emphasis && "border-0",
      )}
    >
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-right">
        <span
          className={cn(
            "block font-mono tabular",
            emphasis ? "text-2xl font-semibold sm:text-3xl" : "text-[15px] font-medium",
          )}
        >
          {value}
        </span>
        {hint ? <span className="mt-0.5 block text-[12px] text-subtle">{hint}</span> : null}
      </span>
    </div>
  );
}
