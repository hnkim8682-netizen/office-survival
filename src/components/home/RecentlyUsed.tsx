"use client";

import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { useRecentToolIds } from "@/lib/hooks/useRecentTools";
import { getTool } from "@/lib/registry";

/** Rendered only once the visitor actually has history — no empty state noise. */
export function RecentlyUsed() {
  const { ids, hydrated } = useRecentToolIds();
  const tools = ids.map(getTool).filter((tool) => tool?.enabled);

  if (!hydrated || tools.length === 0) return null;

  return (
    <section aria-label="최근 사용한 도구" className="animate-[fade-in_0.3s_ease-out]">
      <h2 className="mb-3 text-[13px] font-medium text-subtle">최근 사용</h2>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link
            key={tool!.id}
            href={tool!.href}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[13px] text-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            <Icon name={tool!.icon} size={15} />
            {tool!.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
