import { getFirebaseApp } from "@/lib/firebase/client";

import type { AnalyticsEvent, AnalyticsParams } from "./events";

export { ANALYTICS_EVENTS } from "./events";
export type { AnalyticsEvent, AnalyticsParams } from "./events";

type LoggerFn = (event: string, params?: AnalyticsParams) => void;

let loggerPromise: Promise<LoggerFn | null> | null = null;

function loadFirebaseLogger(): Promise<LoggerFn | null> {
  loggerPromise ??= (async () => {
    const app = await getFirebaseApp();
    if (!app) return null;
    try {
      const { getAnalytics, isSupported, logEvent } = await import("firebase/analytics");
      if (!(await isSupported())) return null;
      const analytics = getAnalytics(app);
      return (event, params) => logEvent(analytics, event, params);
    } catch {
      return null;
    }
  })();

  return loggerPromise;
}

/**
 * Fire-and-forget analytics. Never blocks the UI, never throws, and silently
 * becomes a no-op when Firebase is not configured.
 */
export function track(event: AnalyticsEvent, params?: AnalyticsParams): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, params ?? {});
  }

  void loadFirebaseLogger().then((logger) => {
    logger?.(event, {
      ...params,
      viewport: window.innerWidth < 768 ? "mobile" : "desktop",
    });
  });
}
