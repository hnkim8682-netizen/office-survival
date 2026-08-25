const PREFIX = "office-survival";

export const STORAGE_KEYS = {
  preferences: `${PREFIX}:preferences`,
  recentTools: `${PREFIX}:recent-tools`,
  theme: `${PREFIX}:theme`,
  game2048: `${PREFIX}:2048`,
} as const;
