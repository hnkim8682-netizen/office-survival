import Link from "next/link";
import type { ReactNode } from "react";

import { Icon } from "./Icon";

interface SectionHeadingProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  children?: ReactNode;
}

export function SectionHeading({
  emoji,
  title,
  description,
  action,
  children,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
          {emoji ? (
            <span aria-hidden="true" className="text-base sm:text-lg">
              {emoji}
            </span>
          ) : null}
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {children}
      {action ? (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          {action.label}
          <Icon name="arrowRight" size={16} />
        </Link>
      ) : null}
    </div>
  );
}
