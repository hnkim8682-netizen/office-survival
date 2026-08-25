"use client";

import { useState } from "react";

import { ResultRow } from "@/components/tools/ResultRow";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Label, Select } from "@/components/ui/Field";
import { Tabs } from "@/components/ui/Tabs";
import { formatMinutesKorean, parseHourMinute } from "@/lib/utils/time";
import { pad2 } from "@/lib/utils/format";

type Mode = "diff" | "work" | "shift";

const TABS = [
  { id: "diff" as const, label: "시간 차이" },
  { id: "work" as const, label: "근무시간" },
  { id: "shift" as const, label: "시간 더하기 · 빼기" },
];

/** Minutes between two wall-clock times, wrapping past midnight. */
function minutesBetween(start: string, end: string): number | null {
  const a = parseHourMinute(start);
  const b = parseHourMinute(end);
  if (!a || !b) return null;

  const startMinutes = a.hours * 60 + a.minutes;
  const endMinutes = b.hours * 60 + b.minutes;
  return endMinutes >= startMinutes ? endMinutes - startMinutes : endMinutes + 1440 - startMinutes;
}

function formatClock(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(normalized / 60))}:${pad2(normalized % 60)}`;
}

export function TimeCalculator() {
  const [mode, setMode] = useState<Mode>("diff");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("18:00");
  const [breakMinutes, setBreakMinutes] = useState(60);
  const [standardHours, setStandardHours] = useState(8);
  const [baseTime, setBaseTime] = useState("09:00");
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(30);
  const [direction, setDirection] = useState<"add" | "subtract">("add");

  const span = minutesBetween(start, end);
  const startMinutes = parseHourMinute(start);
  const endMinutes = parseHourMinute(end);
  const wrapsMidnight =
    startMinutes !== null &&
    endMinutes !== null &&
    endMinutes.hours * 60 + endMinutes.minutes < startMinutes.hours * 60 + startMinutes.minutes;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      <div>
        <Tabs tabs={TABS} value={mode} onChange={setMode} label="시간 계산 방식" />

        <Card className="mt-4">
          <CardBody className="space-y-4">
            {mode !== "shift" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="time-start">{mode === "work" ? "출근 시간" : "시작 시간"}</Label>
                  <Input
                    id="time-start"
                    type="time"
                    value={start}
                    onChange={(event) => setStart(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time-end">{mode === "work" ? "퇴근 시간" : "종료 시간"}</Label>
                  <Input
                    id="time-end"
                    type="time"
                    value={end}
                    onChange={(event) => setEnd(event.target.value)}
                  />
                </div>
              </div>
            ) : null}

            {mode === "work" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="time-break">휴게 시간 (분)</Label>
                  <Input
                    id="time-break"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={breakMinutes}
                    onChange={(event) => setBreakMinutes(Number(event.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="time-standard">소정근로 (시간)</Label>
                  <Input
                    id="time-standard"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={0.5}
                    value={standardHours}
                    onChange={(event) => setStandardHours(Number(event.target.value))}
                  />
                </div>
              </div>
            ) : null}

            {mode === "shift" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="time-base">기준 시간</Label>
                  <Input
                    id="time-base"
                    type="time"
                    value={baseTime}
                    onChange={(event) => setBaseTime(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time-hours">시간</Label>
                  <Input
                    id="time-hours"
                    type="number"
                    inputMode="numeric"
                    value={hours}
                    onChange={(event) => setHours(Number(event.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="time-minutes">분</Label>
                  <Input
                    id="time-minutes"
                    type="number"
                    inputMode="numeric"
                    value={minutes}
                    onChange={(event) => setMinutes(Number(event.target.value))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="time-direction">방향</Label>
                  <Select
                    id="time-direction"
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
          {mode === "diff" ? (
            span === null ? (
              <Empty />
            ) : (
              <dl>
                <ResultRow label="시간 차이" value={formatMinutesKorean(span)} emphasis />
                <ResultRow label="시:분" value={formatClock(span)} />
                <ResultRow label="총 분" value={`${span.toLocaleString("ko-KR")}분`} />
                <ResultRow
                  label="소수 시간"
                  value={`${(span / 60).toFixed(2)}시간`}
                  hint={wrapsMidnight ? "자정을 넘긴 것으로 계산했습니다" : undefined}
                />
              </dl>
            )
          ) : null}

          {mode === "work" ? (
            span === null ? (
              <Empty />
            ) : (
              (() => {
                const worked = Math.max(span - Math.max(breakMinutes, 0), 0);
                const standard = Math.max(standardHours, 0) * 60;
                const overtime = Math.max(worked - standard, 0);
                const shortfall = Math.max(standard - worked, 0);

                return (
                  <dl>
                    <ResultRow label="실근무 시간" value={formatMinutesKorean(worked)} emphasis />
                    <ResultRow label="체류 시간" value={formatMinutesKorean(span)} />
                    <ResultRow label="휴게 시간" value={formatMinutesKorean(breakMinutes)} />
                    <ResultRow
                      label="초과 근무"
                      value={formatMinutesKorean(overtime)}
                      hint={overtime > 0 ? "소정근로 초과분" : undefined}
                    />
                    <ResultRow label="부족한 시간" value={formatMinutesKorean(shortfall)} />
                    <ResultRow label="소수 시간" value={`${(worked / 60).toFixed(2)}시간`} />
                  </dl>
                );
              })()
            )
          ) : null}

          {mode === "shift" ? (
            (() => {
              const base = parseHourMinute(baseTime);
              if (!base || !Number.isFinite(hours) || !Number.isFinite(minutes)) return <Empty />;

              const delta = (hours * 60 + minutes) * (direction === "add" ? 1 : -1);
              const total = base.hours * 60 + base.minutes + delta;
              const dayShift = Math.floor(total / 1440);

              return (
                <dl>
                  <ResultRow label="결과 시간" value={formatClock(total)} emphasis />
                  <ResultRow
                    label="날짜 변화"
                    value={dayShift === 0 ? "당일" : dayShift > 0 ? `+${dayShift}일` : `${dayShift}일`}
                  />
                  <ResultRow label="이동한 시간" value={formatMinutesKorean(Math.abs(delta))} />
                  <ResultRow label="기준 시간" value={baseTime} />
                </dl>
              );
            })()
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}

function Empty() {
  return <p className="py-6 text-center text-[13px] text-subtle">시간을 입력해 주세요.</p>;
}
