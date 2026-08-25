import { CATEGORIES, TOOLS } from "./data";
import type { CategoryId, CategoryMeta, ToolEntry } from "./types";

export type { CategoryId, CategoryMeta, ToolEntry, ToolStatus } from "./types";
export { CATEGORIES, TOOLS } from "./data";

/**
 * Every read of the registry goes through these selectors. When the catalog
 * moves to Firestore, only this file swaps its data source — pages, search and
 * the sitemap keep calling the same functions.
 */

const byOrder = (a: ToolEntry, b: ToolEntry) => a.order - b.order;

export function getTools(options: { includeSoon?: boolean } = {}): ToolEntry[] {
  const { includeSoon = true } = options;
  return TOOLS.filter((tool) => includeSoon || tool.enabled).sort(byOrder);
}

export function getToolsByCategory(
  category: CategoryId,
  options: { includeSoon?: boolean } = {},
): ToolEntry[] {
  return getTools(options).filter((tool) => tool.category === category);
}

export function getTool(id: string): ToolEntry | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolByHref(href: string): ToolEntry | undefined {
  return TOOLS.find((tool) => tool.href === href);
}

export function getCategory(id: CategoryId): CategoryMeta {
  const category = CATEGORIES.find((item) => item.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

export interface SearchResult {
  tool: ToolEntry;
  score: number;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Small hand-rolled ranker: exact name > name prefix > name contains >
 * keyword > description. Enabled tools outrank "coming soon" ones.
 */
export function searchTools(query: string, limit = 20): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const tool of TOOLS) {
    const name = normalize(tool.name);
    const description = normalize(tool.description);
    const category = getCategory(tool.category);
    const keywords = [...tool.keywords, tool.id, category.label].map(normalize);

    let score = 0;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 85;
    else if (name.includes(q)) score = 70;
    else if (keywords.some((keyword) => keyword === q)) score = 65;
    else if (keywords.some((keyword) => keyword.startsWith(q))) score = 55;
    else if (keywords.some((keyword) => keyword.includes(q) || q.includes(keyword))) score = 45;
    else if (description.includes(q)) score = 30;

    if (score === 0) continue;
    if (!tool.enabled) score -= 20;
    results.push({ tool, score });
  }

  return results
    .sort((a, b) => b.score - a.score || a.tool.order - b.tool.order)
    .slice(0, limit);
}
