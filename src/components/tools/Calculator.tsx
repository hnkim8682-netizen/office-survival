"use client";

import { useEffect, useReducer } from "react";

import { Card } from "@/components/ui/Card";
import { Kbd } from "@/components/ui/Kbd";
import {
  INITIAL_CALCULATOR,
  calculatorReducer,
  formatDisplay,
  type CalculatorAction,
} from "@/lib/tools/calculator";
import { cn } from "@/lib/utils/cn";

type KeyDef = {
  label: string;
  action: CalculatorAction;
  tone?: "default" | "muted" | "accent";
  wide?: boolean;
  aria?: string;
};

const KEYS: KeyDef[] = [
  { label: "AC", action: { type: "clear" }, tone: "muted", aria: "전체 지우기" },
  { label: "±", action: { type: "negate" }, tone: "muted", aria: "부호 바꾸기" },
  { label: "%", action: { type: "percent" }, tone: "muted", aria: "퍼센트" },
  { label: "÷", action: { type: "operator", value: "÷" }, tone: "accent", aria: "나누기" },

  { label: "7", action: { type: "digit", value: "7" } },
  { label: "8", action: { type: "digit", value: "8" } },
  { label: "9", action: { type: "digit", value: "9" } },
  { label: "×", action: { type: "operator", value: "×" }, tone: "accent", aria: "곱하기" },

  { label: "4", action: { type: "digit", value: "4" } },
  { label: "5", action: { type: "digit", value: "5" } },
  { label: "6", action: { type: "digit", value: "6" } },
  { label: "−", action: { type: "operator", value: "-" }, tone: "accent", aria: "빼기" },

  { label: "1", action: { type: "digit", value: "1" } },
  { label: "2", action: { type: "digit", value: "2" } },
  { label: "3", action: { type: "digit", value: "3" } },
  { label: "+", action: { type: "operator", value: "+" }, tone: "accent", aria: "더하기" },

  { label: "0", action: { type: "digit", value: "0" }, wide: true },
  { label: ".", action: { type: "dot" }, aria: "소수점" },
  { label: "⌫", action: { type: "backspace" }, tone: "muted", aria: "한 글자 지우기" },
];

const KEYBOARD_MAP: Record<string, CalculatorAction> = {
  "+": { type: "operator", value: "+" },
  "-": { type: "operator", value: "-" },
  "*": { type: "operator", value: "×" },
  "/": { type: "operator", value: "÷" },
  "%": { type: "percent" },
  ".": { type: "dot" },
  ",": { type: "dot" },
  Enter: { type: "equals" },
  "=": { type: "equals" },
  Backspace: { type: "backspace" },
  Delete: { type: "clear" },
  Escape: { type: "clear" },
};

export function Calculator() {
  const [state, dispatch] = useReducer(calculatorReducer, INITIAL_CALCULATOR);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        dispatch({ type: "digit", value: event.key });
        return;
      }

      const action = KEYBOARD_MAP[event.key];
      if (action) {
        event.preventDefault();
        dispatch(action);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="overflow-hidden">
        <div className="px-5 pb-5 pt-7">
          <p className="h-5 text-right text-[13px] text-subtle tabular" aria-hidden="true">
            {state.expression}
          </p>
          <output
            aria-live="polite"
            className="mt-1 block truncate text-right font-mono text-[clamp(2rem,9vw,3rem)] font-semibold leading-tight tabular"
          >
            {formatDisplay(state.current)}
          </output>
        </div>

        <div className="grid grid-cols-4 gap-px border-t border-border bg-border">
          {KEYS.map((key) => (
            <button
              key={key.label}
              type="button"
              onClick={() => dispatch(key.action)}
              aria-label={key.aria ?? key.label}
              className={cn(
                "flex h-16 items-center justify-center bg-surface text-[19px] font-medium transition-colors sm:h-[68px]",
                "hover:bg-surface-2 active:bg-surface-3",
                key.tone === "muted" && "text-muted",
                key.tone === "accent" && "bg-surface-2 text-accent",
                key.wide && "col-span-2",
              )}
            >
              {key.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => dispatch({ type: "equals" })}
            aria-label="계산하기"
            className="col-span-4 flex h-16 items-center justify-center bg-accent text-[19px] font-semibold text-accent-fg transition-colors hover:bg-accent-hover sm:h-[68px]"
          >
            =
          </button>
        </div>
      </Card>

      <p className="mt-4 hidden items-center justify-center gap-2 text-[12.5px] text-subtle sm:flex">
        키보드 지원 · <Kbd>0-9</Kbd> <Kbd>+</Kbd> <Kbd>-</Kbd> <Kbd>*</Kbd> <Kbd>/</Kbd>{" "}
        <Kbd>Enter</Kbd> <Kbd>Esc</Kbd>
      </p>
    </div>
  );
}
