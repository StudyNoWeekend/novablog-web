import { apiFetch } from "./client";
import type { ListResult, Recipe, RecipeDetail } from "@/lib/types";

export interface GetRecipesParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  difficulty?: number; // 1=简单 2=中等 3=困难
}

/** 美食菜谱列表 */
export async function getRecipes(
  params: GetRecipesParams = {}
): Promise<ListResult<Recipe>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.difficulty) query.set("difficulty", String(params.difficulty));

  const qs = query.toString();
  const path = qs ? `/public/recipes?${qs}` : "/public/recipes";

  try {
    return await apiFetch<ListResult<Recipe>>(path);
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    // failed 标记供列表页区分「加载失败」与「暂无内容」
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0, failed: true };
  }
}

/** 美食菜谱详情（含食材清单与步骤） */
export async function getRecipeById(id: string): Promise<RecipeDetail | null> {
  try {
    return await apiFetch<RecipeDetail>(`/public/recipes/${id}`);
  } catch (error) {
    console.error("Failed to fetch recipe detail:", error);
    return null;
  }
}
