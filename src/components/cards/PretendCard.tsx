import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { ToolEntry } from "@/lib/registry";
import { cn } from "@/lib/utils/cn";

import { PretendPreview } from "./PretendPreview";

export function PretendCard({ tool, className }: { tool: ToolEntry; className?: string }) {
  const inner = (
    <>
      <PretendPreview id={tool.id} />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <Icon name={tool.icon} size={16} className="text-muted" />
            {tool.name}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{tool.description}</p>
        </div>
        {tool.enabled ? (
          <Icon
            name="arrowUpRight"
            size={16}
            className="mt-1 text-subtle opacity-0 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <Badge>준비중</Badge>
        )}
      </div>
    </>
  );

  const base = cn(
    "group flex h-full flex-col rounded-2xl border border-border bg-surface p-4 transition-all duration-200",
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
      className={cn(base, "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-card)]")}
    >
      {inner}
    </Link>
  );
}
