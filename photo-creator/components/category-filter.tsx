"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/api";

interface CategoryFilterProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id?: string) => void;
  allLabel?: string;
}

export function CategoryFilter({ categories, selectedId, onSelect, allLabel = "全部" }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className={cn(
          "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
          selectedId
            ? "border border-border bg-muted text-muted-foreground hover:bg-muted/80"
            : "bg-primary text-primary-foreground"
        )}
      >
        {allLabel}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.id)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
            selectedId === cat.id
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
