/** Analytics event names, kept in one place so dashboards stay predictable. */
export const ANALYTICS_EVENTS = {
  toolOpen: "tool_open",
  pretendModeOpen: "pretend_mode_open",
  bossMode: "boss_mode",
  search: "search",
  countdownSet: "countdown_set",
  gameStart: "game_start",
  gameOver: "game_over",
  themeChange: "theme_change",
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;
