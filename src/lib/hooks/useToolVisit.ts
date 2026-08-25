"use client";

import { useEffect } from "react";

import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { recordToolUsage } from "@/lib/storage/recent-tools";

/**
 * Records a visit once per mount: recent-tools list + an analytics event.
 * Dropped into every tool/pretend/fun page so tracking stays declarative.
 */
export function useToolVisit(toolId: string, category: string): void {
  useEffect(() => {
    recordToolUsage(toolId);
    track(category === "pretend" ? ANALYTICS_EVENTS.pretendModeOpen : ANALYTICS_EVENTS.toolOpen, {
      tool_id: toolId,
      category,
    });
  }, [toolId, category]);
}
