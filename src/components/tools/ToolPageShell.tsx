import type { ReactNode } from "react";

import { ToolGrid } from "@/components/cards/ToolGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { getCategory, getTool, getToolsByCategory } from "@/lib/registry";

import { TrackVisit } from "./TrackVisit";

interface ToolPageShellProps {
  /** Registry id — title, description and breadcrumbs come from there. */
  toolId: string;
  children: ReactNode;
  /** Extra copy rendered under the tool, useful for SEO context. */
  footnote?: ReactNode;
}

export function ToolPageShell({ toolId, children, footnote }: ToolPageShellProps) {
  const tool = getTool(toolId);
  if (!tool) throw new Error(`Unknown tool: ${toolId}`);

  const category = getCategory(tool.category);
  const related = getToolsByCategory(tool.category, { includeSoon: false })
    .filter((item) => item.id !== tool.id)
    .slice(0, 4);

  return (
    <>
      <TrackVisit toolId={tool.id} category={tool.category} />

      <PageHeader
        title={tool.name}
        description={tool.description}
        breadcrumbs={[
          { label: category.label, href: category.href },
          { label: tool.name, href: tool.href },
        ]}
      />

      <Container className="py-8 sm:py-10">
        {children}

        {footnote ? (
          <div className="mt-12 max-w-3xl text-[13.5px] leading-relaxed text-muted">{footnote}</div>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="mb-4 text-[13px] font-medium uppercase tracking-wider text-subtle">
              {category.emoji} {category.label} 더 보기
            </h2>
            <ToolGrid tools={related} columns={4} />
          </section>
        ) : null}
      </Container>
    </>
  );
}
