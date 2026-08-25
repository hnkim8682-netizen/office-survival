"use client";

import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

interface PretendControlsProps {
  bossActive: boolean;
  bossLabel: string;
  onToggleBoss: () => void;
}

/**
 * Floating controls. While Boss Mode is on they collapse to a neutral hint so
 * nothing on screen gives the game away.
 */
export function PretendControls({ bossActive, bossLabel, onToggleBoss }: PretendControlsProps) {
  if (bossActive) {
    return (
      <button
        type="button"
        onClick={onToggleBoss}
        aria-label="원래 화면으로 돌아가기"
        className="fixed bottom-3 right-3 z-50 rounded-md border border-white/10 bg-black/25 px-2 py-1 font-mono text-[10px] text-white/35 opacity-50 transition-opacity hover:opacity-100"
      >
        ESC
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 opacity-70 transition-opacity hover:opacity-100">
      <Link
        href="/pretend"
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/12 bg-neutral-900/85 px-3 text-[12.5px] font-medium text-white/70 backdrop-blur",
          "transition-colors hover:border-white/25 hover:text-white",
        )}
      >
        <Icon name="close" size={14} />
        나가기
      </Link>

      <button
        type="button"
        onClick={onToggleBoss}
        title={`${bossLabel} 화면으로 즉시 전환 (ESC)`}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-400/50 bg-red-600/90 px-3 text-[12.5px] font-semibold text-white backdrop-blur transition-colors hover:bg-red-500"
      >
        🚨 BOSS MODE
        <kbd className="ml-1 rounded border border-white/30 px-1 font-mono text-[10px] text-white/80">
          ESC
        </kbd>
      </button>
    </div>
  );
}
