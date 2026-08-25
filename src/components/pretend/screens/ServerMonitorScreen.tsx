"use client";

import { useEffect, useMemo, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { seededRandom, seededSeries } from "@/lib/pretend/random";
import { cn } from "@/lib/utils/cn";

/* Boss Mode target for the terminal: an infrastructure monitoring board. */

const NODES = [
  { name: "api-prod-01", region: "ap-northeast-2a", status: "healthy" },
  { name: "api-prod-02", region: "ap-northeast-2b", status: "healthy" },
  { name: "worker-prod-01", region: "ap-northeast-2a", status: "healthy" },
  { name: "worker-prod-02", region: "ap-northeast-2c", status: "degraded" },
  { name: "db-primary", region: "ap-northeast-2a", status: "healthy" },
  { name: "db-replica-01", region: "ap-northeast-2b", status: "healthy" },
];

const STATUS_STYLES: Record<string, string> = {
  healthy: "bg-[#12805c]/15 text-[#3ddc97]",
  degraded: "bg-[#8a6d1f]/20 text-[#f2c14e]",
  down: "bg-[#8a2020]/20 text-[#ff6b6b]",
};

export function ServerMonitorScreen() {
  const reducedMotion = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => setTick((value) => value + 1), 2000);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const metrics = useMemo(() => {
    const random = seededRandom(tick + 11);
    return {
      cpu: 34 + random() * 22,
      memory: 61 + random() * 9,
      network: 412 + random() * 120,
      rps: 1_840 + random() * 260,
      p95: 128 + random() * 40,
      errorRate: 0.12 + random() * 0.1,
    };
  }, [tick]);

  const requestSeries = useMemo(() => seededSeries(tick + 3, 48, 40, 100), [tick]);
  const latencySeries = useMemo(() => seededSeries(tick + 29, 48, 25, 85), [tick]);

  return (
    <div className="min-h-dvh bg-[#111217] p-4 text-[#d6d9e0] sm:p-6">
      <header className="flex flex-wrap items-center gap-3 border-b border-white/8 pb-4">
        <h1 className="text-[15px] font-semibold text-white">Production · Service Health</h1>
        <span className="rounded-md bg-[#12805c]/15 px-2 py-0.5 text-[11.5px] text-[#3ddc97]">
          All systems operational
        </span>
        <span className="ml-auto text-[11.5px] text-[#7c8494]">
          자동 새로고침 2s · 최근 6시간
        </span>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Gauge label="CPU 사용률" value={metrics.cpu} suffix="%" max={100} />
        <Gauge label="메모리 사용률" value={metrics.memory} suffix="%" max={100} />
        <Gauge label="네트워크 I/O" value={metrics.network} suffix=" MB/s" max={800} />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <ChartCard
          title="요청 처리량"
          value={`${Math.round(metrics.rps).toLocaleString("ko-KR")} req/s`}
          series={requestSeries}
          color="#4d8dff"
        />
        <ChartCard
          title="응답 지연 (p95)"
          value={`${Math.round(metrics.p95)} ms`}
          series={latencySeries}
          color="#3ddc97"
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-white/8 bg-[#171921] p-4">
          <p className="text-[13px] font-semibold text-white">노드 상태</p>
          <div className="scrollbar-slim mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-[12.5px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-[#7c8494]">
                  <th className="pb-2 font-medium">노드</th>
                  <th className="pb-2 font-medium">리전</th>
                  <th className="pb-2 font-medium">상태</th>
                  <th className="pb-2 text-right font-medium">CPU</th>
                  <th className="pb-2 text-right font-medium">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {NODES.map((node, index) => {
                  const random = seededRandom(tick + index * 17 + 5);
                  const cpu = 22 + random() * 46;
                  return (
                    <tr key={node.name} className="border-t border-white/6">
                      <td className="py-2 font-mono text-[12px] text-white">{node.name}</td>
                      <td className="py-2 text-[#9aa2af]">{node.region}</td>
                      <td className="py-2">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[11px]",
                            STATUS_STYLES[node.status],
                          )}
                        >
                          {node.status}
                        </span>
                      </td>
                      <td className="py-2 text-right tabular">{cpu.toFixed(1)}%</td>
                      <td className="py-2 text-right tabular text-[#9aa2af]">
                        {(38 + index * 3).toFixed(0)}d
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-[#171921] p-4">
          <p className="text-[13px] font-semibold text-white">최근 이벤트</p>
          <ul className="mt-3 space-y-2.5 text-[12px]">
            {[
              ["14:02", "worker-prod-02 응답 지연 임계값 초과", "warn"],
              ["13:47", "자동 스케일링: 인스턴스 4 → 6", "info"],
              ["13:12", "배포 완료 main@8f2c19d", "ok"],
              ["12:38", "db-replica-01 복제 지연 정상화", "ok"],
              ["11:54", "CDN 캐시 무효화 38 routes", "info"],
            ].map(([time, message, level]) => (
              <li key={time} className="flex gap-2.5">
                <span className="font-mono text-[#7c8494]">{time}</span>
                <span
                  className={cn(
                    "size-1.5 translate-y-1.5 rounded-full",
                    level === "warn" ? "bg-[#f2c14e]" : level === "ok" ? "bg-[#3ddc97]" : "bg-[#4d8dff]",
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1 text-[#c3c8d2]">{message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-[#5f6673]">
        오류율 {metrics.errorRate.toFixed(2)}% · SLA 99.98% · 마지막 인시던트 27일 전
      </p>
    </div>
  );
}

function Gauge({
  label,
  value,
  suffix,
  max,
}: {
  label: string;
  value: number;
  suffix: string;
  max: number;
}) {
  const percent = Math.min((value / max) * 100, 100);
  const tone = percent > 80 ? "#ff6b6b" : percent > 60 ? "#f2c14e" : "#3ddc97";

  return (
    <div className="rounded-xl border border-white/8 bg-[#171921] p-4">
      <p className="text-[12px] text-[#7c8494]">{label}</p>
      <p className="mt-1.5 text-[22px] font-semibold tracking-tight tabular text-white">
        {value.toFixed(value > 100 ? 0 : 1)}
        <span className="text-[13px] font-normal text-[#7c8494]">{suffix}</span>
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%`, background: tone }}
        />
      </div>
    </div>
  );
}

function ChartCard({
  title,
  value,
  series,
  color,
}: {
  title: string;
  value: string;
  series: number[];
  color: string;
}) {
  const points = series
    .map((point, index) => `${(index / (series.length - 1)) * 100},${100 - point}`)
    .join(" ");

  return (
    <div className="rounded-xl border border-white/8 bg-[#171921] p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[13px] font-semibold text-white">{title}</p>
        <p className="text-[13px] tabular text-[#9aa2af]">{value}</p>
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="mt-3 h-28 w-full"
        aria-hidden="true"
      >
        <polyline points={`0,100 ${points} 100,100`} fill={color} opacity="0.12" />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
