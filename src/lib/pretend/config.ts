/**
 * Which screen each pretend mode swaps to when Boss Mode fires. Adding a new
 * disguise means adding a screen component and one entry here.
 */
export interface PretendModeConfig {
  id: string;
  /** Screen shown normally. */
  screen: ScreenId;
  /** Screen shown while Boss Mode is on. */
  bossScreen: ScreenId;
  /** Short label for the Boss Mode hint. */
  bossLabel: string;
}

export type ScreenId =
  | "vscode"
  | "excel"
  | "terminal"
  | "dashboard"
  | "financial-report"
  | "server-monitor";

export const PRETEND_MODES: Record<string, PretendModeConfig> = {
  vscode: {
    id: "vscode",
    screen: "vscode",
    bossScreen: "dashboard",
    bossLabel: "Business Dashboard",
  },
  excel: {
    id: "excel",
    screen: "excel",
    bossScreen: "financial-report",
    bossLabel: "Financial Report",
  },
  terminal: {
    id: "terminal",
    screen: "terminal",
    bossScreen: "server-monitor",
    bossLabel: "Server Monitor",
  },
  dashboard: {
    id: "dashboard",
    screen: "dashboard",
    bossScreen: "financial-report",
    bossLabel: "Financial Report",
  },
};

export function getPretendMode(id: string): PretendModeConfig {
  const mode = PRETEND_MODES[id];
  if (!mode) throw new Error(`Unknown pretend mode: ${id}`);
  return mode;
}
