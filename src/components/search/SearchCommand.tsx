"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { Kbd } from "@/components/ui/Kbd";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { getCategory, getTools, searchTools } from "@/lib/registry";
import { cn } from "@/lib/utils/cn";

const MAX_RESULTS = 8;

/** Header search: a compact trigger plus a ⌘K command palette. */
export function SearchCommand({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const suggestions = useMemo(
    () => getTools({ includeSoon: false }).slice(0, 6),
    [],
  );
  const results = useMemo(() => {
    if (!query.trim()) return suggestions;
    return searchTools(query, MAX_RESULTS).map((result) => result.tool);
  }, [query, suggestions]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    // Send focus back where it came from, as a dialog should.
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    // Only ⌘K / Ctrl+K: a bare "/" would collide with the calculator and the
    // spreadsheet, which both accept raw keystrokes.
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const { style } = document.body;
    const previous = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, [open]);

  const go = (href: string) => {
    if (query.trim()) track(ANALYTICS_EVENTS.search, { query: query.trim(), target: href });
    close();
    router.push(href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(results.length, 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % Math.max(results.length, 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const tool = results[activeIndex];
      if (tool && tool.enabled) go(tool.href);
      else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="검색 열기"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "group inline-flex items-center gap-2 rounded-lg border border-border bg-surface text-muted",
          "transition-colors hover:border-border-strong hover:text-fg",
          "size-9 justify-center sm:h-9 sm:w-56 sm:justify-start sm:px-3",
          className,
        )}
      >
        <Icon name="search" size={16} />
        <span className="hidden text-[13px] sm:inline">도구 검색</span>
        <Kbd className="ml-auto hidden sm:inline">⌘K</Kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[12vh]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="사이트 검색"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-[var(--shadow-pop)]"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Icon name="search" size={18} className="text-subtle" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="엑셀, 계산기, 퇴근…"
                aria-label="검색어"
                aria-controls={listId}
                autoComplete="off"
                className="h-14 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-subtle"
              />
              <button
                type="button"
                onClick={close}
                aria-label="검색 닫기"
                className="rounded-md p-1 text-subtle transition-colors hover:text-fg"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <ul id={listId} className="scrollbar-slim max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-muted">
                  검색 결과가 없습니다.
                </li>
              ) : (
                results.map((tool, index) => {
                  const category = getCategory(tool.category);
                  const isActive = index === activeIndex;

                  return (
                    <li key={tool.id}>
                      <Link
                        href={tool.enabled ? tool.href : `/search?q=${encodeURIComponent(query)}`}
                        onClick={(event) => {
                          event.preventDefault();
                          if (tool.enabled) go(tool.href);
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        aria-disabled={!tool.enabled}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                          isActive ? "bg-surface-2" : "hover:bg-surface-2",
                          !tool.enabled && "opacity-55",
                        )}
                      >
                        <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface text-muted">
                          <Icon name={tool.icon} size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2 text-sm font-medium text-fg">
                            {tool.name}
                            {!tool.enabled ? (
                              <span className="text-[11px] font-normal text-subtle">준비중</span>
                            ) : null}
                          </span>
                          <span className="block truncate text-[12.5px] text-muted">
                            {tool.description}
                          </span>
                        </span>
                        <span className="hidden shrink-0 text-[11px] text-subtle sm:block">
                          {category.emoji} {category.label}
                        </span>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-subtle">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> 이동
                <Kbd className="ml-2">Enter</Kbd> 열기
              </span>
              {query.trim() ? (
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={close}
                  className="font-medium text-muted transition-colors hover:text-fg"
                >
                  전체 검색 결과 보기 →
                </Link>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Kbd>Esc</Kbd> 닫기
                </span>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
