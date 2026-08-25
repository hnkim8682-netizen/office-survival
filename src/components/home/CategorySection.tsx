import { PretendCard } from "@/components/cards/PretendCard";
import { ToolGrid } from "@/components/cards/ToolGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategory, getToolsByCategory, type CategoryId } from "@/lib/registry";

interface CategorySectionProps {
  category: CategoryId;
  /** Cap the number of cards on the home page. */
  limit?: number;
  includeSoon?: boolean;
}

export function CategorySection({ category, limit, includeSoon = false }: CategorySectionProps) {
  const meta = getCategory(category);
  const tools = getToolsByCategory(category, { includeSoon });
  const visible = limit ? tools.slice(0, limit) : tools;

  if (visible.length === 0) return null;

  return (
    <section aria-labelledby={`section-${category}`}>
      <SectionHeading
        emoji={meta.emoji}
        title={meta.title}
        description={meta.description}
        action={{ href: meta.href, label: "전체 보기" }}
      />
      <div id={`section-${category}`} className="sr-only">
        {meta.title}
      </div>

      {category === "pretend" ? (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {visible.map((tool) => (
            <PretendCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <ToolGrid tools={visible} columns={4} />
      )}
    </section>
  );
}
