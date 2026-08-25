export type Operator = "+" | "-" | "×" | "÷";

export interface CalculatorState {
  /** Digits currently being entered. */
  current: string;
  /** Left-hand operand, once an operator was pressed. */
  previous: string | null;
  operator: Operator | null;
  /** Next digit replaces the display instead of appending. */
  overwrite: boolean;
  /** "12 × 4" — shown above the display. */
  expression: string;
  error: boolean;
}

export type CalculatorAction =
  | { type: "digit"; value: string }
  | { type: "dot" }
  | { type: "operator"; value: Operator }
  | { type: "equals" }
  | { type: "clear" }
  | { type: "backspace" }
  | { type: "percent" }
  | { type: "negate" };

export const INITIAL_CALCULATOR: CalculatorState = {
  current: "0",
  previous: null,
  operator: null,
  overwrite: false,
  expression: "",
  error: false,
};

const MAX_DIGITS = 15;

/** Trims floating point noise (0.1 + 0.2) without killing precision. */
function normalize(value: number): string {
  if (!Number.isFinite(value)) return "Error";
  const rounded = Number.parseFloat(value.toPrecision(12));
  return String(rounded);
}

function apply(a: number, b: number, operator: Operator): number {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? Number.NaN : a / b;
  }
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  if (state.error && action.type !== "clear") return state;

  switch (action.type) {
    case "digit": {
      if (state.overwrite || state.current === "0") {
        return { ...state, current: action.value, overwrite: false };
      }
      if (state.current.replace(/[-.]/g, "").length >= MAX_DIGITS) return state;
      return { ...state, current: state.current + action.value };
    }

    case "dot": {
      if (state.overwrite) return { ...state, current: "0.", overwrite: false };
      if (state.current.includes(".")) return state;
      return { ...state, current: `${state.current}.` };
    }

    case "negate": {
      if (state.current === "0") return state;
      return {
        ...state,
        current: state.current.startsWith("-") ? state.current.slice(1) : `-${state.current}`,
      };
    }

    case "percent": {
      const value = Number(state.current) / 100;
      return { ...state, current: normalize(value), overwrite: true };
    }

    case "backspace": {
      if (state.overwrite) return state;
      const next = state.current.slice(0, -1);
      return { ...state, current: next === "" || next === "-" ? "0" : next };
    }

    case "operator": {
      // Chained operators fold the pending calculation first.
      if (state.previous !== null && state.operator && !state.overwrite) {
        const result = apply(Number(state.previous), Number(state.current), state.operator);
        const value = normalize(result);
        if (value === "Error") return { ...INITIAL_CALCULATOR, current: "Error", error: true };
        return {
          ...state,
          previous: value,
          current: value,
          operator: action.value,
          overwrite: true,
          expression: `${value} ${action.value}`,
        };
      }

      return {
        ...state,
        previous: state.current,
        operator: action.value,
        overwrite: true,
        expression: `${state.current} ${action.value}`,
      };
    }

    case "equals": {
      if (state.previous === null || !state.operator) return state;
      const result = apply(Number(state.previous), Number(state.current), state.operator);
      const value = normalize(result);
      if (value === "Error") return { ...INITIAL_CALCULATOR, current: "Error", error: true };

      return {
        current: value,
        previous: null,
        operator: null,
        overwrite: true,
        expression: `${state.previous} ${state.operator} ${state.current} =`,
        error: false,
      };
    }

    case "clear":
      return INITIAL_CALCULATOR;
  }
}

/** Thousand separators, without touching an in-progress decimal. */
export function formatDisplay(value: string): string {
  if (value === "Error") return value;
  const [integer, decimal] = value.split(".");
  const grouped = Number(integer).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const safeInteger = Number.isFinite(Number(integer)) ? grouped : integer;
  return decimal === undefined ? safeInteger : `${safeInteger}.${decimal}`;
}
