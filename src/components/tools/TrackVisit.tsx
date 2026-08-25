"use client";

import { useToolVisit } from "@/lib/hooks/useToolVisit";

/** Server pages drop this in to record a visit and fire analytics. */
export function TrackVisit({ toolId, category }: { toolId: string; category: string }) {
  useToolVisit(toolId, category);
  return null;
}
