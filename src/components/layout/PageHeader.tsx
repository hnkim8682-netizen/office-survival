import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeaderProps {
  emoji?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  children?: ReactNode;
}

export function PageHeader({
  emoji,
  title,
  description,
  breadcrumbs = [],
  children,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="glow-accent pointer-events-none absolute inset-x-0 top-0 h-40" aria-hidden="true" />
      <Container className="relative py-9 sm:py-12">
        {breadcrumbs.length > 0 ? (
          <nav aria-label="경로" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-subtle">
              <li>
                <Link href="/" className="transition-colors hover:text-fg">
                  홈
                </Link>
              </li>
              {breadcrumbs.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  <Icon name="arrowRight" size={12} className="text-border-strong" />
                  <Link href={crumb.href} className="transition-colors hover:text-fg">
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
          {emoji ? <span aria-hidden="true">{emoji}</span> : null}
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-balance text-[15px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
        {children}
      </Container>
    </div>
  );
}
