import type { ToolEntry } from "@/lib/registry";
import { cn } from "@/lib/utils/cn";

import { ToolCard } from "./ToolCard";

interface ToolGridProps {
  tools: ToolEntry[];
  className?: string;
  columns?: 2 | 3 | 4;
}

const COLUMNS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function ToolGrid({ tools, className, columns = 4 }: ToolGridProps) {
  if (tools.length === 0) return null;

  return (
    <div className={cn("grid gap-3 sm:gap-4", COLUMNS[columns], className)}>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
