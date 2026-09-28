import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChefHat, ListChecks, Timer, Users } from "lucide-react";
import { recipes, getModuleConfig, resolveFileUrl, RecipeDetail } from "@/lib/api";
import { ModuleDisabled } from "@/components/module-disabled";
import { RECIPE_DIFFICULTY_META, splitTags } from "@/components/recipe-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await recipes.list({ page: 1, page_size: 100 });
    if (res.list.length === 0) return [{ id: FALLBACK_ID }];
    return res.list.map((recipe) => ({ id: recipe.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "菜谱未找到" };
  }
  try {
    const recipe = await recipes.detail(id);
    return { title: recipe.title, description: recipe.summary };
  } catch {
    return { title: "菜谱未找到" };
  }
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.recipe_enabled) {
    return <ModuleDisabled moduleLabel="美食菜谱" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }

  let recipe: RecipeDetail;
  try {
    recipe = await recipes.detail(id);
  } catch {
    notFound();
  }

  const ingredients = recipe.ingredients ?? [];
  const steps = recipe.steps ?? [];
  const tags = splitTags(recipe.tags);
  const difficulty = RECIPE_DIFFICULTY_META[recipe.difficulty];

  return (
    <div className="flex flex-1 flex-col">
      {/* 返回 */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/recipes"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回菜谱列表
        </Link>
      </div>

      {/* 封面 + 标题信息 */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-muted">
          {recipe.cover ? (
            <Image
              src={recipe.cover}
              alt={recipe.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900">
              <ChefHat className="h-10 w-10 text-white/70" aria-hidden="true" />
            </div>
          )}
          {difficulty && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white backdrop-blur ${difficulty.className}`}
            >
              {difficulty.label}
            </span>
          )}
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {recipe.title}
        </h1>
        {recipe.summary && (
          <blockquote className="mt-3 border-l-2 border-primary pl-4 text-base italic leading-relaxed text-muted-foreground">
            {recipe.summary}
          </blockquote>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {recipe.minutes > 0 && (
            <span className="flex items-center gap-1.5">
              <Timer className="h-4 w-4" aria-hidden="true" />
              {recipe.minutes} 分钟
            </span>
          )}
          {recipe.servings > 0 && (
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" aria-hidden="true" />
              {recipe.servings} 人份
            </span>
          )}
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* 食材清单 */}
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:px-6 lg:px-8">
        {ingredients.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
              <ListChecks className="h-5 w-5 text-primary" aria-hidden="true" />
              食材清单
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {ingredients.map((ingredient, i) => (
                <li
                  key={`ingredient-${i}`}
                  className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-2.5 text-sm"
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
          <section className="mt-10">
            <h2 className="mb-6 text-xl font-bold text-foreground">制作步骤</h2>
            <ol className="space-y-8">
              {steps.map((step, i) => {
                const imageUrl = resolveFileUrl(step.image);
                return (
                  <li key={`step-${i}`} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      {step.text && (
                        <p className="leading-relaxed text-foreground">{step.text}</p>
                      )}
                      {imageUrl && (
                        <div className="relative mt-4 aspect-[16/9] w-full max-w-xl overflow-hidden rounded-lg border border-border bg-muted">
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
    </div>
  );
}
