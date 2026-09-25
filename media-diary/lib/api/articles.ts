import { apiFetch } from "./client";
import type { Article, ArticleDetail, Paginated } from "@/lib/types";

export interface GetArticlesParams {
  page?: number;
  page_size?: number;
  category_id?: string;
  keyword?: string;
}

export async function getArticles(
  params: GetArticlesParams = {}
): Promise<Paginated<Article>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.category_id) query.set("category_id", params.category_id);
  if (params.keyword) query.set("keyword", params.keyword);

  const qs = query.toString();
  const path = qs ? `/public/articles?${qs}` : "/public/articles";

  try {
    return await apiFetch<Paginated<Article>>(path);
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}

export async function getHotArticles(count = 5): Promise<Article[]> {
  try {
    return await apiFetch<Article[]>(`/public/articles/hot?count=${count}`);
  } catch (error) {
    console.error("Failed to fetch hot articles:", error);
    return [];
  }
}

export async function getRandomArticles(count = 5): Promise<Article[]> {
  try {
    return await apiFetch<Article[]>(
      `/public/articles/random?count=${count}`
    );
  } catch (error) {
    console.error("Failed to fetch random articles:", error);
    return [];
  }
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleDetail | null> {
  try {
    return await apiFetch<ArticleDetail>(`/public/articles/${slug}`);
  } catch (error) {
    console.error("Failed to fetch article detail:", error);
    return null;
  }
}

export async function incrementArticleView(slug: string): Promise<void> {
  try {
    await apiFetch<null>(`/public/articles/${slug}/view`, { method: "POST" });
  } catch (error) {
    console.error("Failed to increment article view:", error);
  }
}
