import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { ToolEntry } from "@/lib/registry";
import { cn } from "@/lib/utils/cn";

interface ToolCardProps {
  tool: ToolEntry;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl border border-border bg-surface-2 text-muted transition-colors",
            tool.enabled && "group-hover:border-accent/40 group-hover:bg-accent-soft group-hover:text-accent",
          )}
        >
          <Icon name={tool.icon} size={19} />
        </span>
        {tool.enabled ? (
          <Icon
            name="arrowUpRight"
            size={16}
            className="text-subtle opacity-0 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <Badge>준비중</Badge>
        )}
      </div>

      <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{tool.name}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{tool.description}</p>
    </>
  );

  const base = cn(
    "group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200",
    className,
  );

  if (!tool.enabled) {
    return (
      <div className={cn(base, "opacity-60")} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={tool.href}
      className={cn(
        base,
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-card)]",
      )}
    >
      {inner}
    </Link>
  );
}
