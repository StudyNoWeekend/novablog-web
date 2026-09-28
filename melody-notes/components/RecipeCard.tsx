"use client";

import Image from "next/image";
import Link from "next/link";
import { ChefHat, Clock, Users } from "lucide-react";
import { getFileUrl } from "@/lib/api/client";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
}

/** 难度 1=简单 2=中等 3=困难 */
const DIFFICULTY_LABELS: Record<number, string> = {
  1: "简单",
  2: "中等",
  3: "困难",
};

/** 解析逗号分隔的 tags 字符串 */
function parseTags(tags: string): string[] {
  return String(tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const tags = parseTags(recipe.tags);

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      {/* 封面 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        {recipe.cover ? (
          <Image
            src={getFileUrl(recipe.cover)}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(100%_120%_at_50%_0%,#1d2f26_0%,#16211c_70%)]">
            <ChefHat className="h-10 w-10 text-accent/40" strokeWidth={1} />
          </div>
        )}
        {DIFFICULTY_LABELS[recipe.difficulty] && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-on-accent">
            {DIFFICULTY_LABELS[recipe.difficulty]}
          </span>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-[17px] font-bold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent">
          {recipe.title}
        </h3>
        {recipe.summary && (
          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
            {recipe.summary}
          </p>
        )}

        {/* 耗时 / 份量 / 标签 */}
        <div className="mt-3 flex flex-1 flex-wrap content-end items-center gap-x-3 gap-y-1.5 text-xs text-text-subtle">
          {recipe.minutes > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              {recipe.minutes} 分钟
            </span>
          )}
          {recipe.servings > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
              {recipe.servings} 人份
            </span>
          )}
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-background-soft px-2 py-0.5 text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
