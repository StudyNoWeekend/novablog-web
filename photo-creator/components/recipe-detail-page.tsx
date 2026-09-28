"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChefHat, ListChecks, Timer, Users } from "lucide-react";
import { resolveFileUrl, type RecipeDetail } from "@/lib/api";
import { RECIPE_DIFFICULTY_META, splitTags } from "./recipe-card";
import { cn } from "@/lib/utils";

interface RecipeDetailPageProps {
  recipe: RecipeDetail;
}

export function RecipeDetailPage({ recipe }: RecipeDetailPageProps) {
  const ingredients = recipe.ingredients ?? [];
  const steps = recipe.steps ?? [];
  const tags = splitTags(recipe.tags);
  const difficulty = RECIPE_DIFFICULTY_META[recipe.difficulty];

  return (
    <article className="bg-background">
      <div className="relative aspect-[21/9] w-full bg-muted md:aspect-[21/8]">
        {recipe.cover ? (
          <Image
            src={recipe.cover}
            alt={recipe.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ChefHat className="size-12" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          返回菜谱
        </Link>

        <header className="mt-8">
          <h1 className="font-heading text-3xl font-normal leading-tight text-foreground md:text-4xl lg:text-5xl">
            {recipe.title}
          </h1>
          {recipe.summary && (
            <p className="mt-6 border-l-2 border-primary pl-5 text-lg italic leading-relaxed text-muted-foreground">
              {recipe.summary}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {difficulty && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                  difficulty.className
                )}
              >
                {difficulty.label}
              </span>
            )}
            {recipe.minutes > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Timer className="size-4" aria-hidden="true" />
                {recipe.minutes} 分钟
              </span>
            )}
            {recipe.servings > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" aria-hidden="true" />
                {recipe.servings} 人份
              </span>
            )}
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {ingredients.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 flex items-center gap-2 font-heading text-2xl font-medium text-foreground">
              <ListChecks className="size-5 text-primary" aria-hidden="true" />
              食材清单
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {ingredients.map((ingredient, i) => (
                <li
                  key={`ingredient-${i}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
                >
                  <span className="text-foreground">{ingredient.name}</span>
                  {ingredient.amount && (
                    <span className="shrink-0 text-muted-foreground">{ingredient.amount}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 编号步骤（含配图，相对路径拼站点 /files/ 前缀） */}
        {steps.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-8 font-heading text-2xl font-medium text-foreground">制作步骤</h2>
            <ol className="space-y-8">
              {steps.map((step, i) => {
                const imageUrl = resolveFileUrl(step.image);
                return (
                  <li key={`step-${i}`} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-medium text-primary-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      {step.text && (
                        <p className="leading-relaxed text-foreground/90">{step.text}</p>
                      )}
                      {imageUrl && (
                        <div className="relative mt-4 aspect-[16/9] w-full max-w-xl overflow-hidden rounded-xl border border-border bg-muted">
                          <Image
                            src={imageUrl}
                            alt={`步骤 ${i + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 576px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </div>
    </article>
  );
}
