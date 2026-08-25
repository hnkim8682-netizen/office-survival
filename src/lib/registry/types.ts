export type CategoryId = "pretend" | "tools" | "ai" | "fun";

export type ToolStatus = "live" | "soon";

export interface CategoryMeta {
  id: CategoryId;
  /** Short label used in navigation, without the emoji. */
  label: string;
  emoji: string;
  href: string;
  title: string;
  description: string;
}

export interface ToolEntry {
  id: string;
  name: string;
  category: CategoryId;
  href: string;
  description: string;
  /** Key into the shared icon set (see components/ui/Icon). */
  icon: string;
  status: ToolStatus;
  enabled: boolean;
  /** Extra search terms (Korean + English) that should match this entry. */
  keywords: string[];
  /** Lower numbers sort first inside a category. */
  order: number;
}
