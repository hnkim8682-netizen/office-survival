import { PretendCard } from "@/components/cards/PretendCard";
import { ToolGrid } from "@/components/cards/ToolGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { getCategory, getToolsByCategory, type CategoryId } from "@/lib/registry";

/** Shared body for /pretend, /tools, /ai and /fun. */
export function CategoryPage({ category }: { category: CategoryId }) {
  const meta = getCategory(category);
  const tools = getToolsByCategory(category);
  const live = tools.filter((tool) => tool.enabled);
  const soon = tools.filter((tool) => !tool.enabled);

  return (
    <>
      <PageHeader
        emoji={meta.emoji}
        title={meta.title}
        description={meta.description}
        breadcrumbs={[{ label: meta.label, href: meta.href }]}
      />

      <Container className="py-10 sm:py-12">
        {category === "pretend" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((tool) => (
              <PretendCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <ToolGrid tools={live} columns={3} />
        )}

        {soon.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-[13px] font-medium uppercase tracking-wider text-subtle">
              준비중
            </h2>
            <ToolGrid tools={soon} columns={4} />
          </section>
        ) : null}
      </Container>
    </>
  );
}
