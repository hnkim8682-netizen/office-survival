"use client";

import { useEffect, useMemo, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { TOKEN_COLORS, tokenize } from "@/lib/pretend/highlight";
import { cn } from "@/lib/utils/cn";

/* Colors below are VS Code Dark+ values on purpose: this screen must look like
   the editor, not like the rest of the site. */

interface EditorFile {
  name: string;
  path: string;
  language: string;
  code: string;
}

const FILES: EditorFile[] = [
  {
    name: "Dashboard.tsx",
    path: "src > components > Dashboard.tsx",
    language: "TypeScript React",
    code: `import { useEffect, useMemo, useState } from "react";
import { fetchMetrics } from "@/lib/api/client";
import { formatCurrency } from "@/utils/format";

interface DashboardProps {
  workspaceId: string;
  range: "7d" | "30d" | "90d";
}

// 대시보드 지표를 불러와 카드 형태로 렌더링한다
export function Dashboard({ workspaceId, range }: DashboardProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await fetchMetrics({ workspaceId, range });
      if (cancelled) return;
      setMetrics(response.items);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [workspaceId, range]);

  const revenue = useMemo(() => {
    return metrics.reduce((total, metric) => total + metric.revenue, 0);
  }, [metrics]);

  if (loading) return <DashboardSkeleton />;

  return (
    <section className="dashboard-grid">
      <MetricCard label="총 매출" value={formatCurrency(revenue)} />
      {metrics.map((metric) => (
        <MetricCard key={metric.id} label={metric.label} value={metric.value} />
      ))}
    </section>
  );
}`,
  },
  {
    name: "client.ts",
    path: "src > lib > api > client.ts",
    language: "TypeScript",
    code: `import { z } from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const metricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  revenue: z.number(),
});

export type Metric = z.infer<typeof metricSchema>;

// 지표 API는 실패 시 두 번까지 재시도한다
export async function fetchMetrics(params: FetchParams, retries = 2) {
  const query = new URLSearchParams({
    workspace: params.workspaceId,
    range: params.range,
  });

  try {
    const response = await fetch(BASE_URL + "/metrics?" + query, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new ApiError(response.status, "metrics request failed");
    }

    const json = await response.json();
    return { items: metricSchema.array().parse(json.items) };
  } catch (error) {
    if (retries > 0) return fetchMetrics(params, retries - 1);
    throw error;
  }
}`,
  },
  {
    name: "format.ts",
    path: "src > utils > format.ts",
    language: "TypeScript",
    code: `const KRW = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return KRW.format(value);
}

// 1234567 -> "123.5만"
export function formatCompact(value: number): string {
  if (value < 10000) return value.toLocaleString("ko-KR");
  return (value / 10000).toFixed(1) + "만";
}

export function formatPercent(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : "";
  return sign + value.toFixed(digits) + "%";
}`,
  },
];

const TREE = [
  { depth: 0, label: "OFFICE-SURVIVAL", kind: "root" },
  { depth: 1, label: "src", kind: "folder" },
  { depth: 2, label: "app", kind: "folder" },
  { depth: 3, label: "layout.tsx", kind: "file" },
  { depth: 3, label: "page.tsx", kind: "file" },
  { depth: 2, label: "components", kind: "folder" },
  { depth: 3, label: "Dashboard.tsx", kind: "file" },
  { depth: 3, label: "MetricCard.tsx", kind: "file" },
  { depth: 2, label: "lib", kind: "folder" },
  { depth: 3, label: "client.ts", kind: "file" },
  { depth: 2, label: "utils", kind: "folder" },
  { depth: 3, label: "format.ts", kind: "file" },
  { depth: 2, label: "config.ts", kind: "file" },
  { depth: 1, label: "package.json", kind: "file" },
  { depth: 1, label: "tsconfig.json", kind: "file" },
] as const;

const TYPING_INTERVAL = 34;
const CHARS_PER_TICK = 4;
/** Files open already partly written — an empty editor looks idle. */
const HEAD_START = 0.45;
const FILE_PAUSE_MS = 2600;

function headStart(fileIndex: number): number {
  return Math.floor(FILES[fileIndex].code.length * HEAD_START);
}

export function VSCodeScreen() {
  const reducedMotion = usePrefersReducedMotion();
  // File and caret position move together, so they live in one state value.
  const [progress, setProgress] = useState(() => ({ fileIndex: 0, typed: headStart(0) }));

  const file = FILES[progress.fileIndex];
  const complete = progress.typed >= file.code.length;

  useEffect(() => {
    if (reducedMotion || complete) return;

    const interval = window.setInterval(() => {
      setProgress((current) => ({
        ...current,
        typed: Math.min(
          current.typed + CHARS_PER_TICK,
          FILES[current.fileIndex].code.length,
        ),
      }));
    }, TYPING_INTERVAL);

    return () => window.clearInterval(interval);
  }, [reducedMotion, complete]);

  // Once a file finishes typing, pause and move on to the next one.
  useEffect(() => {
    if (reducedMotion || !complete) return;

    const timeout = window.setTimeout(() => {
      setProgress((current) => {
        const fileIndex = (current.fileIndex + 1) % FILES.length;
        return { fileIndex, typed: headStart(fileIndex) };
      });
    }, FILE_PAUSE_MS);

    return () => window.clearTimeout(timeout);
  }, [reducedMotion, complete]);

  const lines = useMemo(
    () => (reducedMotion ? file.code : file.code.slice(0, progress.typed)).split("\n"),
    [file.code, progress.typed, reducedMotion],
  );
  const column = (lines.at(-1)?.length ?? 0) + 1;

  return (
    <div className="flex min-h-dvh flex-col bg-[#1e1e1e] font-mono text-[#d4d4d4] selection:bg-[#264f78]">
      {/* Title bar */}
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-black/40 bg-[#3c3c3c] px-3 text-[12px] text-[#cccccc]">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="mx-auto truncate">
          {file.name} — office-survival — Visual Studio Code
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Activity bar */}
        <div className="hidden w-12 shrink-0 flex-col items-center gap-4 border-r border-black/40 bg-[#333333] py-3 text-[#858585] sm:flex">
          {["files", "search", "git", "debug", "ext"].map((item, index) => (
            <span
              key={item}
              className={cn(
                "flex size-8 items-center justify-center rounded",
                index === 0 && "border-l-2 border-white text-white",
              )}
              aria-hidden="true"
            >
              <ActivityIcon index={index} />
            </span>
          ))}
        </div>

        {/* Explorer */}
        <aside className="hidden w-56 shrink-0 flex-col border-r border-black/40 bg-[#252526] md:flex">
          <p className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-[#bbbbbb]">
            Explorer
          </p>
          <ul className="scrollbar-slim flex-1 overflow-y-auto pb-4 text-[12.5px]">
            {TREE.map((node) => {
              const active = node.label === file.name;
              return (
                <li
                  key={`${node.depth}-${node.label}`}
                  style={{ paddingLeft: 8 + node.depth * 12 }}
                  className={cn(
                    "flex items-center gap-1.5 py-[3px] pr-2",
                    node.kind === "root" && "font-semibold uppercase tracking-wide text-[#cccccc]",
                    active ? "bg-[#37373d] text-white" : "text-[#cccccc]",
                  )}
                >
                  {node.kind !== "file" ? (
                    <span className="text-[#cccccc]" aria-hidden="true">
                      ▾
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#519aba]" aria-hidden="true">
                      ●
                    </span>
                  )}
                  <span className="truncate">{node.label}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Editor */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-black/40 bg-[#252526] text-[12.5px]">
            {FILES.map((tab, index) => (
              <span
                key={tab.name}
                className={cn(
                  "flex items-center gap-2 border-r border-black/40 px-3.5 whitespace-nowrap",
                  index === progress.fileIndex
                    ? "bg-[#1e1e1e] text-white"
                    : "bg-[#2d2d2d] text-[#969696]",
                )}
              >
                <span className="text-[#519aba]" aria-hidden="true">
                  TS
                </span>
                {tab.name}
                {index === progress.fileIndex ? (
                  <span className="size-1.5 rounded-full bg-white/70" aria-hidden="true" />
                ) : null}
              </span>
            ))}
          </div>

          <div className="shrink-0 px-4 py-1.5 text-[11.5px] text-[#8c8c8c]">{file.path}</div>

          <div className="scrollbar-slim min-h-0 flex-1 overflow-auto px-1 pb-8 text-[12.5px] leading-[1.55] sm:text-[13.5px]">
            <pre className="min-w-max">
              <code>
                {lines.map((line, index) => (
                  <div key={index} className="flex">
                    <span className="w-10 shrink-0 select-none pr-3 text-right text-[#6e7681] sm:w-14">
                      {index + 1}
                    </span>
                    <span className="whitespace-pre">
                      {tokenize(line).map((token, tokenIndex) => (
                        <span key={tokenIndex} style={{ color: TOKEN_COLORS[token.kind] }}>
                          {token.text}
                        </span>
                      ))}
                      {index === lines.length - 1 ? (
                        <span className="ml-px inline-block h-[1.1em] w-[7px] translate-y-[2px] bg-[#aeafad] animate-blink" />
                      ) : null}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-6 shrink-0 items-center gap-4 bg-[#007acc] px-3 text-[11.5px] text-white">
        <span>⎇ main*</span>
        <span>⟳ 0↓ 1↑</span>
        <span>✗ 0 ⚠ 0</span>
        <span className="ml-auto hidden sm:inline">Ln {lines.length}, Col {column}</span>
        <span className="hidden sm:inline">Spaces: 2</span>
        <span className="hidden md:inline">UTF-8</span>
        <span className="hidden md:inline">LF</span>
        <span>{file.language}</span>
        <span className="hidden sm:inline">Prettier ✓</span>
      </div>
    </div>
  );
}

function ActivityIcon({ index }: { index: number }) {
  const shapes = ["▤", "⌕", "⑂", "▷", "⊞"];
  return <span className="text-[17px] leading-none">{shapes[index]}</span>;
}
