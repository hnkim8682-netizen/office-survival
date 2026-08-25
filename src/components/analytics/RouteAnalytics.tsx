"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

/**
 * App Router navigations do not reload the page, so page views are reported
 * here. No-op until Firebase env vars are present.
 */
export function RouteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    track(ANALYTICS_EVENTS.pageView, { page_path: pathname });
  }, [pathname]);

  return null;
}
