"use client";


import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";


interface CategoryFilterProps {
  active: string;
  onChange: (slug: string) => void;
  includeAll?: boolean;
}

export function CategoryFilter({
  active,
  onChange,
  includeAll = true,
}: CategoryFilterProps) {
  const { categories, loading } = useCategories()

  const tabs = includeAll
    ? [{ slug: "todos", name: "Todos" }, ...categories]
    : categories;

  if (loading) {
    return <>
    <p>Loading</p></>
  }

  return (
    <div className="no-scrollbar -mx-5 overflow-x-auto px-5">
      <div className="flex min-w-max items-center justify-start gap-x-6 gap-y-3 pb-1 md:flex-wrap md:justify-center">
        {tabs.map((tab) => {
          const isActive = active === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => onChange(tab.slug)}
              className={cn(
                "relative whitespace-nowrap py-2 font-display text-sm font-medium uppercase tracking-wide transition-colors",
                isActive
                  ? "text-[hsl(var(--brand))]"
                  : "text-muted-foreground hover:text-[hsl(var(--ink))]",
              )}
            >
              {tab.name}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[hsl(var(--brand))] transition-transform duration-200",
                  isActive ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
