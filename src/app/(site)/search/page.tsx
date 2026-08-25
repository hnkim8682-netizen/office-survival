import { ToolCard } from "@/components/cards/ToolCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchField } from "@/components/search/SearchField";
import { Container } from "@/components/ui/Container";
import { CATEGORIES, getTools, searchTools } from "@/lib/registry";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "검색",
  description:
    "OFFICE SURVIVAL의 모든 도구를 한 번에 검색하세요. 일하는 척 화면, 업무도구, AI 도구, 쉬어가기 기능을 이름과 키워드로 찾을 수 있습니다.",
  path: "/search",
  noIndex: true,
});

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await props.searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  const results = query ? searchTools(query, 30) : [];

  return (
    <>
      <PageHeader
        title={query ? `"${query}" 검색 결과` : "검색"}
        description={
          query
            ? `${results.length}개의 도구를 찾았습니다.`
            : "도구 이름이나 키워드로 검색해 보세요. 단축키 ⌘K 로도 열 수 있습니다."
        }
        breadcrumbs={[{ label: "검색", href: "/search" }]}
      >
        <SearchField initialQuery={query} />
      </PageHeader>

      <Container className="py-10 sm:py-12">
        {query && results.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {results.map(({ tool }) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : null}

        {query && results.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
            <p className="text-[15px] font-medium">검색 결과가 없습니다.</p>
            <p className="mt-2 text-sm text-muted">
              다른 키워드로 검색하거나 아래 카테고리를 살펴보세요.
            </p>
          </div>
        ) : null}

        {!query ? (
          <section>
            <h2 className="mb-4 text-[13px] font-medium uppercase tracking-wider text-subtle">
              바로 쓸 수 있는 도구
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {getTools({ includeSoon: false }).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        ) : null}

        <nav aria-label="카테고리" className="mt-12 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={category.href}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-[13px] text-muted transition-colors hover:border-border-strong hover:text-fg"
            >
              <span aria-hidden="true">{category.emoji}</span>
              {category.label}
            </a>
          ))}
        </nav>
      </Container>
    </>
  );
}
