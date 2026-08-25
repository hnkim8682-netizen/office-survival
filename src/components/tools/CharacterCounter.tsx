"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Field";
import { cn } from "@/lib/utils/cn";

interface Stat {
  id: string;
  label: string;
  value: number;
  hint?: string;
}

function countStats(text: string): Stat[] {
  const withSpaces = [...text].length;
  const withoutSpaces = [...text.replace(/\s/g, "")].length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text === "" ? 0 : text.split("\n").length;
  const bytes = new TextEncoder().encode(text).length;
  const paragraphs = text.trim() ? text.trim().split(/\n{2,}/).length : 0;

  return [
    { id: "with", label: "글자수 (공백 포함)", value: withSpaces },
    { id: "without", label: "글자수 (공백 제외)", value: withoutSpaces },
    { id: "words", label: "단어수", value: words },
    { id: "lines", label: "줄 수", value: lines },
    { id: "paragraphs", label: "문단 수", value: paragraphs },
    { id: "bytes", label: "바이트", value: bytes, hint: "UTF-8 기준" },
  ];
}

export function CharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => countStats(text), [text]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard permissions can be denied — nothing to recover from.
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div>
        <label htmlFor="counter-input" className="sr-only">
          글자수를 셀 텍스트
        </label>
        <Textarea
          id="counter-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={16}
          placeholder="여기에 텍스트를 붙여넣으면 실시간으로 글자수를 세어 드립니다."
          className="min-h-[320px] resize-y font-[inherit] text-[14.5px]"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={copy} disabled={!text}>
            {copied ? "복사했습니다" : "복사"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={!text}>
            지우기
          </Button>
        </div>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardBody>
          <dl>
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={cn(
                  "flex items-baseline justify-between gap-4 py-2.5",
                  index !== stats.length - 1 && "border-b border-border",
                )}
              >
                <dt className="text-[13px] text-muted">{stat.label}</dt>
                <dd className="text-right">
                  <span
                    className={cn(
                      "block font-mono tabular",
                      index === 0 ? "text-2xl font-semibold" : "text-[15px] font-medium",
                    )}
                    aria-live={index === 0 ? "polite" : undefined}
                  >
                    {stat.value.toLocaleString("ko-KR")}
                  </span>
                  {stat.hint ? (
                    <span className="text-[11.5px] text-subtle">{stat.hint}</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
