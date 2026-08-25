"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { useToolVisit } from "@/lib/hooks/useToolVisit";
import { getPretendMode, type ScreenId } from "@/lib/pretend/config";
import { getTool } from "@/lib/registry";

import { PretendControls } from "./PretendControls";

function ScreenFallback() {
  return <div className="min-h-dvh w-full bg-[#0b0d11]" aria-hidden="true" />;
}

/**
 * Screens load on demand, so a page only ships the disguise it needs — the
 * Boss Mode screen is fetched the first time it is triggered.
 */
const SCREENS: Record<ScreenId, React.ComponentType> = {
  vscode: dynamic(() => import("./screens/VSCodeScreen").then((m) => m.VSCodeScreen), {
    loading: ScreenFallback,
  }),
  excel: dynamic(() => import("./screens/ExcelScreen").then((m) => m.ExcelScreen), {
    loading: ScreenFallback,
  }),
  terminal: dynamic(() => import("./screens/TerminalScreen").then((m) => m.TerminalScreen), {
    loading: ScreenFallback,
  }),
  dashboard: dynamic(() => import("./screens/DashboardScreen").then((m) => m.DashboardScreen), {
    loading: ScreenFallback,
  }),
  "financial-report": dynamic(
    () => import("./screens/FinancialReportScreen").then((m) => m.FinancialReportScreen),
    { loading: ScreenFallback },
  ),
  "server-monitor": dynamic(
    () => import("./screens/ServerMonitorScreen").then((m) => m.ServerMonitorScreen),
    { loading: ScreenFallback },
  ),
};

export function PretendShell({ modeId }: { modeId: string }) {
  const mode = getPretendMode(modeId);
  const tool = getTool(modeId);
  const [bossActive, setBossActive] = useState(false);

  useToolVisit(modeId, "pretend");

  const toggleBoss = useCallback(() => {
    setBossActive((active) => {
      track(ANALYTICS_EVENTS.bossMode, { mode: modeId, active: !active });
      return !active;
    });
  }, [modeId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const target = event.target as HTMLElement | null;
      // Let inputs inside a screen handle Escape first.
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      event.preventDefault();
      toggleBoss();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleBoss]);

  const Screen = SCREENS[bossActive ? mode.bossScreen : mode.screen];

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* The screen is a disguise, so the real page heading is for screen
          readers and search engines only. */}
      <h1 className="sr-only">{tool?.name} 화면 — 일하는 척</h1>
      <p className="sr-only">{tool?.description}</p>

      <Screen />
      <PretendControls
        bossActive={bossActive}
        bossLabel={mode.bossLabel}
        onToggleBoss={toggleBoss}
      />
    </div>
  );
}
