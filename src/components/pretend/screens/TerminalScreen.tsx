"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { pad2 } from "@/lib/utils/format";

type Level = "info" | "muted" | "success" | "warn" | "error" | "command";

interface LogLine {
  id: number;
  time: string | null;
  text: string;
  level: Level;
}

const LEVEL_COLORS: Record<Level, string> = {
  info: "#d4d4d4",
  muted: "#7f8c8d",
  success: "#4ec9b0",
  warn: "#dcdcaa",
  error: "#f14c4c",
  command: "#9cdcfe",
};

/** Looping deploy pipeline. Delay is how long to wait *before* printing. */
const SCRIPT: Array<{ text: string; level: Level; delay: number }> = [
  { text: "▲ office-survival@1.4.2 deploy", level: "info", delay: 600 },
  { text: "Fetching source from github.com/office/survival (main)", level: "muted", delay: 900 },
  { text: "Installing dependencies with npm ci...", level: "muted", delay: 1200 },
  { text: "added 412 packages in 7.4s", level: "muted", delay: 1500 },
  { text: "Building application...", level: "info", delay: 1100 },
  { text: "  ✓ Compiled successfully in 4.8s", level: "success", delay: 1600 },
  { text: "  ✓ Linting and checking validity of types", level: "success", delay: 1300 },
  { text: "Running test suite (142 tests)...", level: "info", delay: 900 },
  { text: "  PASS  src/lib/metrics.test.ts (2.1s)", level: "success", delay: 1200 },
  { text: "  PASS  src/lib/report.test.ts (1.4s)", level: "success", delay: 1000 },
  { text: "  WARN  deprecated option 'legacyCache' ignored", level: "warn", delay: 1100 },
  { text: "  PASS  src/app/api/health.test.ts (0.6s)", level: "success", delay: 1000 },
  { text: "Tests: 142 passed, 142 total", level: "success", delay: 1300 },
  { text: "Uploading build artifacts (24.6 MB)...", level: "muted", delay: 1200 },
  { text: "Invalidating CDN cache for 38 routes", level: "muted", delay: 1400 },
  { text: "Deployment completed in 41s", level: "success", delay: 1200 },
  { text: "https://office-survival.internal.corp — Ready", level: "info", delay: 900 },
  { text: "", level: "muted", delay: 1800 },
];

const BACKLOG_LINES = 11;

const HELP = [
  "사용 가능한 명령어:",
  "  help      명령어 목록",
  "  ls        디렉터리 목록",
  "  status    배포 상태",
  "  whoami    현재 사용자",
  "  clear     화면 지우기",
];

function runCommand(input: string): { text: string; level: Level }[] {
  const command = input.trim();
  if (!command) return [];

  switch (command.split(" ")[0]) {
    case "help":
      return HELP.map((text) => ({ text, level: "muted" as Level }));
    case "ls":
      return [
        { text: "app/        components/  lib/        public/", level: "info" },
        { text: "package.json  tsconfig.json  next.config.ts  README.md", level: "info" },
      ];
    case "status":
      return [
        { text: "● production   ready    41s ago   main@8f2c19d", level: "success" },
        { text: "● preview      building  now      feat/q3-report", level: "warn" },
      ];
    case "whoami":
      return [{ text: "survivor", level: "info" }];
    case "git":
      return [
        { text: "On branch main", level: "info" },
        { text: "Your branch is up to date with 'origin/main'.", level: "muted" },
        { text: "nothing to commit, working tree clean", level: "muted" },
      ];
    case "sudo":
      return [{ text: "survivor is not in the sudoers file. This incident will be reported.", level: "error" }];
    case "exit":
      return [{ text: "정시 퇴근은 아직 지원되지 않습니다.", level: "warn" }];
    default:
      return [{ text: `zsh: command not found: ${command}`, level: "error" }];
  }
}

function timestamp(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

export function TerminalScreen() {
  const reducedMotion = usePrefersReducedMotion();
  const [lines, setLines] = useState<LogLine[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const scriptIndex = useRef(0);
  const seeded = useRef(false);

  const append = useCallback(
    (entries: Array<{ text: string; level: Level }>, withTime = true, offsetMs = 0) => {
      setLines((current) => {
        const stamp = new Date(Date.now() - offsetMs);
        const added = entries.map((entry) => ({
          id: nextId.current++,
          time: withTime && entry.text ? timestamp(stamp) : null,
          text: entry.text,
          level: entry.level,
        }));
        // Keep the buffer bounded — this screen can run for hours.
        return [...current, ...added].slice(-200);
      });
    },
    [],
  );

  // Streams the deploy log forever, one line at a time.
  useEffect(() => {
    // Backfill history first: an empty terminal looks like nothing is running.
    // Guarded so a remount (React strict mode) does not double the backlog.
    if (!seeded.current) {
      seeded.current = true;
      const backlog = SCRIPT.slice(0, BACKLOG_LINES);
      backlog.forEach((step, index) => {
        append([{ text: step.text, level: step.level }], true, (backlog.length - index) * 3400);
      });
      scriptIndex.current = BACKLOG_LINES;
    }

    if (reducedMotion) return;

    let timer = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const step = SCRIPT[scriptIndex.current % SCRIPT.length];
      scriptIndex.current += 1;
      append([{ text: step.text, level: step.level }]);
      timer = window.setTimeout(tick, step.delay);
    };

    timer = window.setTimeout(tick, 900);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [append, reducedMotion]);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [lines]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const command = input;
    setInput("");

    if (command.trim() === "clear") {
      setLines([]);
      return;
    }

    append([{ text: `survivor@office ~ % ${command}`, level: "command" }], false);
    append(runCommand(command), false);
  };

  return (
    <div
      className="flex min-h-dvh flex-col bg-[#0c0c0c] font-mono text-[13px] text-[#d4d4d4] sm:text-[13.5px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex h-9 shrink-0 items-center border-b border-white/10 bg-[#1f1f1f] px-3 text-[12px] text-[#9a9a9a]">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="mx-auto">survivor@office — zsh — 132×34</span>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-slim min-h-0 flex-1 overflow-y-auto px-3 py-3 leading-[1.65] sm:px-5"
        role="log"
        aria-live="off"
        aria-label="터미널 출력"
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.time ? <span className="text-[#6a9955]">[{line.time}] </span> : null}
            <span style={{ color: LEVEL_COLORS[line.level] }}>{line.text || " "}</span>
          </div>
        ))}

        <form onSubmit={onSubmit} className="mt-1 flex items-center gap-2">
          <label htmlFor="terminal-input" className="shrink-0 text-[#4ec9b0]">
            survivor@office <span className="text-[#569cd6]">~</span> %
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="명령어 입력"
            className="flex-1 bg-transparent font-mono text-[#d4d4d4] caret-[#d4d4d4] outline-none"
          />
        </form>
      </div>

      <div className="flex h-6 shrink-0 items-center gap-4 border-t border-white/10 bg-[#1f1f1f] px-3 text-[11px] text-[#7f8c8d]">
        <span>zsh</span>
        <span>main*</span>
        <span className="ml-auto">help 입력 시 명령어 목록</span>
      </div>
    </div>
  );
}
