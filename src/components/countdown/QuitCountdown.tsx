"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { COUNTDOWN_MESSAGES, computeCountdown } from "@/lib/countdown";
import { useNow } from "@/lib/hooks/useNow";
import { usePreferences } from "@/lib/hooks/usePreferences";
import { cn } from "@/lib/utils/cn";
import { pad2 } from "@/lib/utils/format";
import { formatMinutesKorean, resolveTimeZone, splitDuration } from "@/lib/utils/time";

import { CountdownSettings } from "./CountdownSettings";
import { ProgressBar } from "./ProgressBar";

interface QuitCountdownProps {
  /** "hero" hides settings behind a toggle; "full" is the dedicated page. */
  variant?: "hero" | "full";
  className?: string;
}

export function QuitCountdown({ variant = "hero", className }: QuitCountdownProps) {
  const now = useNow(1000);
  const { preferences, update, hydrated } = usePreferences();
  const [settingsOpen, setSettingsOpen] = useState(variant === "full");

  const ready = now !== null && hydrated;
  const snapshot = now ? computeCountdown(now, preferences) : null;
  const { hours, minutes, seconds } = splitDuration(snapshot?.remainingMs ?? 0);
  const isCelebrating = snapshot?.state === "done" || snapshot?.state === "dayOff";

  return (
    <section
      aria-label="퇴근 카운트다운"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8",
        className,
      )}
    >
      <div className="glow-accent pointer-events-none absolute inset-x-0 top-0 h-48" aria-hidden="true" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-muted">
            <Icon name="timer" size={16} className="text-accent" />
            {ready && snapshot ? COUNTDOWN_MESSAGES[snapshot.state] : "퇴근까지"}
          </p>

          {variant === "hero" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen((value) => !value)}
              aria-expanded={settingsOpen}
            >
              <Icon name="settings" size={15} />
              시간 설정
            </Button>
          ) : (
            <span className="text-[12px] text-subtle">{resolveTimeZone()}</span>
          )}
        </div>

        {isCelebrating ? (
          <p className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            {snapshot?.state === "dayOff" ? "푹 쉬세요." : "오늘 하루도 살아남았습니다."}
          </p>
        ) : (
          <div
            className="mt-5 flex items-baseline gap-2 font-mono text-[clamp(2.75rem,11vw,5.5rem)] font-semibold leading-none tracking-tight tabular"
            aria-live="off"
          >
            {ready ? (
              <>
                <span>{pad2(hours)}</span>
                <span className="text-subtle">:</span>
                <span>{pad2(minutes)}</span>
                <span className="text-subtle">:</span>
                <span className="text-accent">{pad2(seconds)}</span>
              </>
            ) : (
              <span className="text-subtle">--:--:--</span>
            )}
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {ready && snapshot
            ? snapshot.state === "working" || snapshot.state === "beforeWork"
              ? `퇴근까지 ${hours}시간 ${minutes}분 남았습니다.`
              : COUNTDOWN_MESSAGES[snapshot.state]
            : ""}
        </p>

        <div className="mt-6">
          <ProgressBar value={snapshot?.progress ?? 0} label="오늘의 근무 진행률" />
          <div className="mt-2 flex items-center justify-between text-[12.5px] text-subtle">
            <span>출근 {preferences.startTime}</span>
            <span className="text-muted">
              오늘의 근무 진행률 {Math.round((snapshot?.progress ?? 0) * 100)}%
            </span>
            <span>퇴근 {preferences.quitTime}</span>
          </div>
        </div>

        {variant === "full" && snapshot ? (
          <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="현재 시각" value={ready && now ? formatClock(now) : "--:--:--"} />
            <Stat label="퇴근 시각" value={preferences.quitTime} />
            <Stat
              label="일한 시간"
              value={ready ? formatMinutesKorean(snapshot.workedMinutes) : "--"}
            />
            <Stat
              label="남은 시간"
              value={
                ready
                  ? snapshot.state === "done" || snapshot.state === "dayOff"
                    ? "0분"
                    : formatMinutesKorean(Math.ceil(snapshot.remainingMs / 60_000))
                  : "--"
              }
            />
          </dl>
        ) : null}

        {settingsOpen ? (
          <div className={cn("mt-7 border-t border-border pt-6", variant === "hero" && "animate-[rise_0.25s_ease-out]") }>
            <CountdownSettings preferences={preferences} onChange={update} />
            <p className="mt-3 text-[12px] text-subtle">
              설정은 이 브라우저에만 저장됩니다. 로그인하면 기기 간 동기화될 예정입니다.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 px-3.5 py-3">
      <dt className="text-[12px] text-subtle">{label}</dt>
      <dd className="mt-1 font-mono text-[15px] font-medium tabular">{value}</dd>
    </div>
  );
}

function formatClock(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}
