import Link from "next/link";
import Image from "next/image";
import { ChefHat, Timer, Users } from "lucide-react";
import type { Recipe } from "@/lib/api";
import { cn } from "@/lib/utils";

/** 难度映射：1=简单 2=中等 3=困难（低饱和徽标，与主题奶油色调协调） */
export const RECIPE_DIFFICULTY_META: Record<number, { label: string; className: string }> = {
  1: { label: "简单", className: "border-emerald-700/25 bg-emerald-700/10 text-emerald-800 dark:text-emerald-300" },
  2: { label: "中等", className: "border-amber-700/25 bg-amber-700/10 text-amber-800 dark:text-amber-300" },
  3: { label: "困难", className: "border-red-800/25 bg-red-800/10 text-red-900 dark:text-red-300" },
};

/** 标签字符串拆分为数组（后端返回逗号分隔） */
export function splitTags(tags?: string): string[] {
  return String(tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/** 美食菜谱卡片：封面 + 难度角标 + 标题 + 简介 + 耗时/份量/标签 */
export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const difficulty = RECIPE_DIFFICULTY_META[recipe.difficulty];
  const tags = splitTags(recipe.tags);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40 focus-within:ring-2 focus-within:ring-ring">
      <Link
        href={`/recipes/${recipe.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
        aria-label={recipe.title}
      >
        {recipe.cover ? (
          <Image
            src={recipe.cover}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ChefHat className="size-10" aria-hidden="true" />
          </div>
        )}
        {difficulty && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
              difficulty.className
            )}
          >
            {difficulty.label}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-medium text-foreground">
          <Link
            href={`/recipes/${recipe.id}`}
            className="rounded transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            {recipe.title}
          </Link>
        </h3>
        {recipe.summary && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {recipe.summary}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {recipe.minutes > 0 && (
            <span className="flex items-center gap-1">
              <Timer className="size-3.5" aria-hidden="true" />
              {recipe.minutes} 分钟
            </span>
          )}
          {recipe.servings > 0 && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5" aria-hidden="true" />
              {recipe.servings} 人份
            </span>
          )}
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
