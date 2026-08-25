"use client";

import { useEffect, useMemo, useState } from "react";

import { useHydrated } from "@/lib/hooks/useHydrated";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { seededRandom } from "@/lib/pretend/random";
import { cn } from "@/lib/utils/cn";

/* Corporate light dashboard — used both as its own pretend mode and as the
   Boss Mode screen for the editor. */

const NAV = [
  { label: "Overview", active: true },
  { label: "Revenue", active: false },
  { label: "Customers", active: false },
  { label: "Pipeline", active: false },
  { label: "Retention", active: false },
  { label: "Reports", active: false },
  { label: "Settings", active: false },
];

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const SERIES = [268, 291, 274, 318, 342, 336, 371, 389, 402, 428, 447, 484];

const CHANNELS = [
  { name: "Direct Sales", value: 42.8, amount: "₩164,480,000" },
  { name: "Partner / Reseller", value: 24.1, amount: "₩92,614,000" },
  { name: "Inbound Marketing", value: 18.6, amount: "₩71,478,000" },
  { name: "Outbound SDR", value: 9.4, amount: "₩36,123,000" },
  { name: "Self-serve", value: 5.1, amount: "₩19,595,000" },
];

const REGIONS = [
  ["서울 · 수도권", "₩182,640,000", "+16.2%", "42,180", "9.1%"],
  ["부산 · 경남", "₩64,210,000", "+8.4%", "18,942", "7.4%"],
  ["대구 · 경북", "₩41,880,000", "+5.1%", "12,308", "6.2%"],
  ["대전 · 충청", "₩38,420,000", "+11.8%", "11,764", "8.0%"],
  ["광주 · 호남", "₩31,050,000", "-2.3%", "9,412", "5.8%"],
  ["APAC (해외)", "₩26,090,000", "+22.7%", "7,884", "11.4%"],
];

export function DashboardScreen() {
  const reducedMotion = usePrefersReducedMotion();
  const [drift, setDrift] = useState(0);
  // Bars and bars-like widths animate from zero on the first client paint.
  const mounted = useHydrated();

  // A slow, deterministic wobble so the numbers look live without flickering.
  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => setDrift((value) => value + 1), 4000);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const kpis = useMemo(() => {
    const random = seededRandom(drift + 7);
    const jitter = (base: number, spread: number) => base + (random() - 0.5) * spread;

    return [
      {
        label: "Revenue (QTD)",
        value: `₩${Math.round(jitter(384_290_000, 240_000)).toLocaleString("ko-KR")}`,
        delta: "+14.7%",
        positive: true,
        series: [42, 48, 45, 55, 58, 64, 72],
      },
      {
        label: "Active Users",
        value: Math.round(jitter(128_492, 180)).toLocaleString("ko-KR"),
        delta: "+6.2%",
        positive: true,
        series: [30, 35, 34, 41, 44, 48, 52],
      },
      {
        label: "Conversion",
        value: `${jitter(8.42, 0.06).toFixed(2)}%`,
        delta: "+0.8%p",
        positive: true,
        series: [22, 26, 25, 29, 28, 33, 36],
      },
      {
        label: "Net Growth",
        value: `+${jitter(14.7, 0.2).toFixed(1)}%`,
        delta: "vs. 전분기",
        positive: true,
        series: [18, 24, 30, 28, 36, 40, 46],
      },
    ];
  }, [drift]);

  const max = Math.max(...SERIES);

  return (
    <div className="flex min-h-dvh bg-[#f6f7f9] text-[#1c2029]">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-[#e4e6ea] bg-white lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-[#e4e6ea] px-5">
          <span className="flex size-7 items-center justify-center rounded-md bg-[#2f6feb] text-[12px] font-bold text-white">
            N
          </span>
          <span className="text-[13.5px] font-semibold">Northwind</span>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {NAV.map((item) => (
            <span
              key={item.label}
              className={cn(
                "rounded-lg px-3 py-2 text-[13px]",
                item.active ? "bg-[#eef3fe] font-medium text-[#2f6feb]" : "text-[#5b616e]",
              )}
            >
              {item.label}
            </span>
          ))}
        </nav>
        <div className="mt-auto border-t border-[#e4e6ea] p-4 text-[12px] text-[#868d99]">
          <p className="font-medium text-[#5b616e]">Q3 FY2026</p>
          <p className="mt-1">데이터 기준 03/31 18:00</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#e4e6ea] bg-white px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold">Executive Overview</p>
            <p className="hidden text-[11.5px] text-[#868d99] sm:block">
              Analytics · 전사 실적 대시보드
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[12.5px]">
            <span className="hidden rounded-lg border border-[#e4e6ea] px-3 py-1.5 text-[#5b616e] sm:inline">
              2026.01.01 – 2026.03.31
            </span>
            <span className="rounded-lg border border-[#e4e6ea] px-3 py-1.5 text-[#5b616e]">
              Export
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#2f6feb] text-[12px] font-semibold text-white">
              KH
            </span>
          </div>
        </header>

        <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {/* KPI cards */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-[#e4e6ea] bg-white p-4 shadow-[0_1px_2px_rgba(16,19,24,0.04)]"
              >
                <p className="text-[12px] text-[#868d99]">{kpi.label}</p>
                <p className="mt-2 text-[22px] font-semibold tracking-tight tabular">{kpi.value}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[11.5px] font-medium",
                      kpi.positive ? "bg-[#e7f6ee] text-[#12805c]" : "bg-[#fdecec] text-[#c0392b]",
                    )}
                  >
                    {kpi.delta}
                  </span>
                  <Sparkline values={kpi.series} />
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="mt-4 grid gap-3 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-[#e4e6ea] bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold">월별 매출 추이</p>
                <span className="text-[11.5px] text-[#868d99]">단위: 백만원</span>
              </div>
              <div className="mt-5 flex h-48 gap-1.5 sm:gap-2.5">
                {SERIES.map((value, index) => (
                  <div key={MONTHS[index]} className="flex h-full flex-1 flex-col items-center gap-2">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-[3px] bg-[#2f6feb] transition-[height] duration-700 ease-out"
                        style={{
                          height: mounted ? `${(value / max) * 100}%` : "0%",
                          opacity: 0.45 + (index / SERIES.length) * 0.55,
                          transitionDelay: `${index * 45}ms`,
                        }}
                      />
                    </div>
                    <span className="text-[10.5px] text-[#868d99]">{MONTHS[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#e4e6ea] bg-white p-4">
              <p className="text-[13px] font-semibold">채널별 기여도</p>
              <ul className="mt-4 space-y-3.5">
                {CHANNELS.map((channel, index) => (
                  <li key={channel.name}>
                    <div className="flex items-baseline justify-between text-[12.5px]">
                      <span className="text-[#3b414d]">{channel.name}</span>
                      <span className="tabular text-[#868d99]">{channel.value}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eef0f3]">
                      <div
                        className="h-full rounded-full bg-[#2f6feb] transition-[width] duration-700 ease-out"
                        style={{
                          width: mounted ? `${channel.value * 2.1}%` : "0%",
                          opacity: 1 - index * 0.13,
                          transitionDelay: `${index * 70}ms`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] tabular text-[#868d99]">{channel.amount}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-[#e4e6ea] bg-white">
            <div className="flex items-center justify-between border-b border-[#e4e6ea] px-4 py-3">
              <p className="text-[13px] font-semibold">지역별 실적</p>
              <span className="text-[11.5px] text-[#868d99]">6 rows</span>
            </div>
            <div className="scrollbar-slim overflow-x-auto">
              <table className="w-full min-w-[640px] text-[12.5px]">
                <thead>
                  <tr className="bg-[#fafbfc] text-left text-[11.5px] uppercase tracking-wide text-[#868d99]">
                    {["지역", "매출", "성장률", "사용자", "전환율"].map((header) => (
                      <th key={header} className="px-4 py-2.5 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REGIONS.map((row) => (
                    <tr key={row[0]} className="border-t border-[#eef0f3]">
                      {row.map((cell, index) => (
                        <td
                          key={index}
                          className={cn(
                            "px-4 py-2.5",
                            index > 0 && "tabular",
                            index === 2 &&
                              (cell.startsWith("-") ? "text-[#c0392b]" : "text-[#12805c]"),
                          )}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const points = values
    .map((value, index) => `${(index / (values.length - 1)) * 72},${24 - (value / max) * 22}`)
    .join(" ");

  return (
    <svg width="72" height="24" viewBox="0 0 72 24" aria-hidden="true" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#2f6feb"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
