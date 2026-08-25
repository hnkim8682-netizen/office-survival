"use client";

import { useEffect, useState } from "react";

import { getRecentToolIds, subscribeToRecentTools } from "@/lib/storage/recent-tools";

export function useRecentToolIds(): { ids: string[]; hydrated: boolean } {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(getRecentToolIds());
    setHydrated(true);
    return subscribeToRecentTools(setIds);
  }, []);

  return { ids, hydrated };
}
