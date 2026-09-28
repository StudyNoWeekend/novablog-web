import Link from "next/link";
import Image from "next/image";
import { ChefHat, Timer, Users } from "lucide-react";
import type { Recipe } from "@/lib/api";

/** 难度映射：1=简单 2=中等 3=困难（封面角标用） */
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
    <Link
      href={`/recipes/${recipe.id}`}
      aria-label={recipe.title}
      className="group card-lift flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {recipe.cover ? (
          <Image
            src={recipe.cover}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ChefHat className="h-10 w-10 text-muted-foreground/60" />
          </div>
        )}
        {difficulty && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-white backdrop-blur ${difficulty.className}`}
          >
            {difficulty.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {recipe.title}
        </h3>
        {recipe.summary && (
          <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">{recipe.summary}</p>
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
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
