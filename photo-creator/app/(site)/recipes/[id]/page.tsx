import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { recipes, getModuleConfig, type RecipeDetail } from "@/lib/api";
import { RecipeDetailPage } from "@/components/recipe-detail-page";
import { ModuleDisabled } from "@/components/module-disabled";

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
    if (!res.list.length) return [{ id: FALLBACK_ID }];
    return res.list.map((recipe) => ({ id: recipe.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

async function fetchRecipe(id: string): Promise<RecipeDetail | null> {
  try {
    return await recipes.detail(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "菜谱未找到" };
  }
  const data = await fetchRecipe(id);
  if (!data) return { title: "美食菜谱" };
  return {
    title: data.title,
    description: data.summary,
    openGraph: {
      title: data.title,
      description: data.summary,
      images: data.cover ? [data.cover] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.recipe_enabled) {
    return <ModuleDisabled moduleLabel="美食菜谱" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const data = await fetchRecipe(id);
  if (!data) notFound();
  return <RecipeDetailPage recipe={data} />;
}
