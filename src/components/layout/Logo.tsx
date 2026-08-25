import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="OFFICE SURVIVAL 홈"
    >
      <span className="relative flex size-7 items-center justify-center rounded-[9px] bg-accent text-[13px] font-bold text-accent-fg">
        OS
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[13.5px] font-semibold tracking-[0.14em] text-fg">
          OFFICE SURVIVAL
        </span>
        <span className="mt-1 hidden text-[10.5px] tracking-[0.08em] text-subtle sm:block">
          직장인 생존도구
        </span>
      </span>
    </Link>
  );
}
