"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export function SearchField({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    track(ANALYTICS_EVENTS.search, { query: trimmed, source: "search_page" });
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-xl gap-2" role="search">
      <div className="relative flex-1">
        <Icon
          name="search"
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="엑셀, 계산기, 퇴근…"
          aria-label="검색어"
          className="h-11 w-full rounded-xl border border-border bg-surface-2 pl-10 pr-3 text-sm text-fg outline-none transition-colors placeholder:text-subtle hover:border-border-strong focus:border-accent"
        />
      </div>
      <Button type="submit">검색</Button>
    </form>
  );
}
