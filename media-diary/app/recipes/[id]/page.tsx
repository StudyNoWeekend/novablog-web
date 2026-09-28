import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { getRecipes, getRecipeById } from "@/lib/api/recipes";
import { getFileUrl } from "@/lib/api/client";
import { getModuleConfig } from "@/lib/api/module-config";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeDetailContent } from "@/components/RecipeDetailContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const res = await getRecipes({ page: 1, page_size: 100 });
  if (res.list.length === 0) return [{ id: FALLBACK_ID }];
  return res.list.map((recipe) => ({ id: recipe.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "菜谱未找到" };
  }
  const recipe = await getRecipeById(id);
  if (!recipe) return { title: "菜谱未找到" };
  return {
    title: recipe.title,
    description: recipe.summary || undefined,
  };
}

/** 难度 1=简单 2=中等 3=困难 */
const DIFFICULTY_LABELS: Record<number, string> = {
  1: "简单",
  2: "中等",
  3: "困难",
};

export default async function RecipeDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.recipe_enabled) {
    return <ModuleDisabled moduleLabel="美食菜谱" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const recipe = await getRecipeById(id);
  if (!recipe) {
    notFound();
  }

  const tags = String(recipe.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const moreRecipes = (await getRecipes({ page: 1, page_size: 100 })).list
    .filter((item) => item.id !== recipe.id)
    .slice(0, 3);

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/recipes"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent-hover"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回菜谱列表
        </Link>
      </div>

      {/* Hero cover */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-xl bg-background-soft shadow-card">
          {recipe.cover ? (
            <Image
              src={getFileUrl(recipe.cover)}
              alt={recipe.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-2xl text-text-subtle">
              今日食谱
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        {/* 难度徽标 */}
        {DIFFICULTY_LABELS[recipe.difficulty] && (
          <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink">
            {DIFFICULTY_LABELS[recipe.difficulty]}
          </span>
        )}
        <h1 className="font-display text-3xl leading-tight text-text-primary md:text-4xl">
          {recipe.title}
        </h1>

        {/* 耗时 / 份量 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
          {recipe.minutes > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
              {recipe.minutes} 分钟
            </span>
          )}
          {recipe.servings > 0 && (
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
              {recipe.servings} 人份
            </span>
          )}
        </div>

        {/* 标签 */}
        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/recipes?keyword=${encodeURIComponent(tag)}`}
                className="min-h-8 cursor-pointer rounded-full border border-accent/25 bg-accent-subtle px-3 py-0.5 text-xs text-accent-hover transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* 简介 */}
        {recipe.summary && (
          <blockquote className="mt-8 border-l-2 border-accent bg-surface-highlight px-4 py-3 text-base italic leading-relaxed text-text-muted md:pl-5">
            {recipe.summary}
          </blockquote>
        )}

        {/* 食材清单与制作步骤（客户端组件：步骤图需运行时拼接文件地址） */}
        <RecipeDetailContent detail={recipe} />
      </div>

      {/* 更多菜谱 */}
      {moreRecipes.length > 0 && (
        <section className="border-t border-border bg-surface-highlight py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-display text-2xl text-text-primary">
              更多菜谱
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreRecipes.map((item) => (
                <RecipeCard key={item.id} recipe={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
