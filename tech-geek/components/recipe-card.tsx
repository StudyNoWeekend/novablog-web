import Link from "next/link";
import Image from "next/image";
import { ChefHat, Timer, Users } from "lucide-react";
import { Recipe } from "@/lib/api";

/** 难度映射：1=简单 2=中等 3=困难（角标样式与封面区分开） */
export const RECIPE_DIFFICULTY_META: Record<number, { label: string; className: string }> = {
  1: { label: "简单", className: "bg-emerald-600/85" },
  2: { label: "中等", className: "bg-amber-600/85" },
  3: { label: "困难", className: "bg-red-600/85" },
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
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-ring">
      <Link
        href={`/recipes/${recipe.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
        aria-label={recipe.title}
      >
        {recipe.cover ? (
          <Image
            src={recipe.cover}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900">
            <ChefHat className="h-8 w-8 text-white/70" aria-hidden="true" />
          </div>
        )}
        {difficulty && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-white backdrop-blur ${difficulty.className}`}
          >
            {difficulty.label}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold tracking-tight text-foreground">
          <Link
            href={`/recipes/${recipe.id}`}
            className="rounded transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {recipe.title}
          </Link>
        </h3>
        {recipe.summary && (
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {recipe.summary}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {recipe.minutes > 0 && (
            <span className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              {recipe.minutes} 分钟
            </span>
          )}
          {recipe.servings > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
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
