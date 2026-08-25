"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CATEGORIES } from "@/lib/registry";
import { cn } from "@/lib/utils/cn";

interface NavLinksProps {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function NavLinks({ variant = "desktop", onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {CATEGORIES.map((category) => {
        const active = pathname === category.href || pathname.startsWith(`${category.href}/`);

        return (
          <Link
            key={category.id}
            href={category.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg font-medium transition-colors",
              variant === "desktop"
                ? "px-3 py-1.5 text-[13.5px]"
                : "px-3 py-3 text-[15px] border border-transparent",
              active
                ? variant === "desktop"
                  ? "bg-surface-2 text-fg"
                  : "border-border bg-surface-2 text-fg"
                : "text-muted hover:bg-surface-2 hover:text-fg",
            )}
          >
            <span aria-hidden="true">{category.emoji}</span>
            {category.label}
          </Link>
        );
      })}
    </>
  );
}
