"use client";

import { useState } from "react";

import { ResultRow } from "@/components/tools/ResultRow";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Field";
import { Tabs } from "@/components/ui/Tabs";
import { useHydrated } from "@/lib/hooks/useHydrated";
import {
  addDays,
  addMonths,
  countWeekdays,
  diffInDays,
  formatDateKorean,
  parseDateKey,
  toDateKey,
} from "@/lib/utils/date";

type Mode = "diff" | "dday" | "shift";
type Unit = "days" | "weeks" | "months" | "years";

const TABS = [
  { id: "diff" as const, label: "날짜 차이" },
  { id: "dday" as const, label: "D-Day" },
  { id: "shift" as const, label: "날짜 더하기 · 빼기" },
];

const UNITS: Array<{ id: Unit; label: string }> = [
  { id: "days", label: "일" },
  { id: "weeks", label: "주" },
  { id: "months", label: "개월" },
  { id: "years", label: "년" },
];

export function DateCalculator() {
  const [mode, setMode] = useState<Mode>("diff");
  const [amount, setAmount] = useState(30);
  const [unit, setUnit] = useState<Unit>("days");
  const [direction, setDirection] = useState<"add" | "subtract">("add");

  // "Today" only exists in the browser, so the defaults are derived after
  // hydration and stay empty during prerender.
  const hydrated = useHydrated();
  const today = hydrated ? toDateKey(new Date()) : "";
  const inThirtyDays = hydrated ? toDateKey(addDays(new Date(), 30)) : "";

  const [fromInput, setFrom] = useState<string | null>(null);
  const [toInput, setTo] = useState<string | null>(null);
  const [targetInput, setTarget] = useState<string | null>(null);
  const [baseInput, setBase] = useState<string | null>(null);

  const from = fromInput ?? today;
  const to = toInput ?? inThirtyDays;
  const target = targetInput ?? inThirtyDays;
  const base = baseInput ?? today;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      <div>
        <Tabs tabs={TABS} value={mode} onChange={setMode} label="날짜 계산 방식" />

        <Card className="mt-4">
          <CardBody className="space-y-4">
            {mode === "diff" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="date-from">시작일</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={from}
                    onChange={(event) => setFrom(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date-to">종료일</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                  />
                </div>
              </div>
            ) : null}

            {mode === "dday" ? (
              <div>
                <Label htmlFor="date-target">목표일</Label>
                <Input
                  id="date-target"
                  type="date"
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                />
                <p className="mt-2 text-[12.5px] text-subtle">
                  입사일, 마감일, 계약 만료일처럼 세어야 할 날짜를 넣어보세요.
                </p>
              </div>
            ) : null}

            {mode === "shift" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="date-base">기준일</Label>
                  <Input
                    id="date-base"
                    type="date"
                    value={base}
                    onChange={(event) => setBase(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date-amount">값</Label>
                  <Input
                    id="date-amount"
                    type="number"
                    inputMode="numeric"
                    value={amount}
                    onChange={(event) => setAmount(Number(event.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="date-unit">단위</Label>
                  <Select
                    id="date-unit"
                    value={unit}
                    onChange={(event) => setUnit(event.target.value as Unit)}
                  >
                    {UNITS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="date-direction">방향</Label>
                  <Select
                    id="date-direction"
                    value={direction}
                    onChange={(event) => setDirection(event.target.value as "add" | "subtract")}
                  >
                    <option value="add">더하기 (이후)</option>
                    <option value="subtract">빼기 (이전)</option>
                  </Select>
                </div>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardBody>
          {mode === "diff" ? <DiffResult from={from} to={to} /> : null}
          {mode === "dday" ? <DDayResult target={target} /> : null}
          {mode === "shift" ? (
            <ShiftResult base={base} amount={amount} unit={unit} direction={direction} />
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}

function Empty() {
  return <p className="py-6 text-center text-[13px] text-subtle">날짜를 입력해 주세요.</p>;
}

function DiffResult({ from, to }: { from: string; to: string }) {
  const start = parseDateKey(from);
  const end = parseDateKey(to);
  if (!start || !end) return <Empty />;

  const days = diffInDays(start, end);
  const absolute = Math.abs(days);
  const weekdays = countWeekdays(start, end);

  return (
    <dl>
      <ResultRow label="차이" value={`${absolute.toLocaleString("ko-KR")}일`} emphasis />
      <ResultRow
        label="양쪽 날짜 포함"
        value={`${(absolute + 1).toLocaleString("ko-KR")}일`}
        hint="시작일과 종료일을 모두 세는 경우"
      />
      <ResultRow label="주 단위" value={`${Math.floor(absolute / 7)}주 ${absolute % 7}일`} />
      <ResultRow label="평일 (월–금)" value={`${weekdays.toLocaleString("ko-KR")}일`} />
      <ResultRow label="주말" value={`${(absolute + 1 - weekdays).toLocaleString("ko-KR")}일`} />
      <ResultRow label="개월 (근사)" value={`약 ${(absolute / 30.44).toFixed(1)}개월`} />
    </dl>
  );
}

function DDayResult({ target }: { target: string }) {
  const date = parseDateKey(target);
  if (!date) return <Empty />;

  const days = diffInDays(new Date(), date);
  const label = days === 0 ? "D-DAY" : days > 0 ? `D-${days}` : `D+${Math.abs(days)}`;

  return (
    <dl>
      <ResultRow label="디데이" value={label} emphasis />
      <ResultRow label="날짜" value={formatDateKorean(date)} />
      <ResultRow
        label={days >= 0 ? "남은 일수" : "지난 일수"}
        value={`${Math.abs(days).toLocaleString("ko-KR")}일`}
      />
      {days > 0 ? (
        <ResultRow
          label="남은 평일"
          value={`${Math.max(countWeekdays(addDays(new Date(), 1), date), 0).toLocaleString("ko-KR")}일`}
          hint="오늘 제외, 월–금 기준"
        />
      ) : null}
      <ResultRow label="주 단위" value={`${Math.floor(Math.abs(days) / 7)}주 ${Math.abs(days) % 7}일`} />
    </dl>
  );
}

function ShiftResult({
  base,
  amount,
  unit,
  direction,
}: {
  base: string;
  amount: number;
  unit: Unit;
  direction: "add" | "subtract";
}) {
  const date = parseDateKey(base);
  if (!date || !Number.isFinite(amount)) return <Empty />;

  const signed = direction === "add" ? amount : -amount;
  const result =
    unit === "days"
      ? addDays(date, signed)
      : unit === "weeks"
        ? addDays(date, signed * 7)
        : unit === "months"
          ? addMonths(date, signed)
          : addMonths(date, signed * 12);

  return (
    <dl>
      <ResultRow label="결과" value={toDateKey(result)} emphasis />
      <ResultRow label="날짜" value={formatDateKorean(result)} />
      <ResultRow
        label="오늘로부터"
        value={`${diffInDays(new Date(), result).toLocaleString("ko-KR")}일`}
      />
      <ResultRow label="기준일" value={formatDateKorean(date)} />
    </dl>
  );
}
