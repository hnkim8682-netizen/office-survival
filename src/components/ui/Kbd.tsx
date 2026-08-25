import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-muted",
        className,
      )}
      {...props}
    />
  );
}
