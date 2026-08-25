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
        {live.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <p className="text-[15px] font-medium">아직 준비 중입니다</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              아래 도구를 순서대로 공개할 예정입니다. 준비되는 대로 홈과 검색에서 바로 사용할 수
              있게 됩니다.
            </p>
          </div>
        ) : category === "pretend" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((tool) => (
              <PretendCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <ToolGrid tools={live} columns={3} />
        )}

        {soon.length > 0 ? (
          <section className={live.length === 0 ? "mt-8" : "mt-12"}>
            <h2 className="mb-4 text-[13px] font-medium uppercase tracking-wider text-subtle">
              공개 예정
            </h2>
            <ToolGrid tools={soon} columns={4} />
          </section>
        ) : null}
      </Container>
    </>
  );
}
