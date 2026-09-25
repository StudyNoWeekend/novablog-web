"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, Flame } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { CatFace } from "@/components/ComicDoodle";
import {
  getArticles,
  getHotArticles,
} from "@/lib/api/articles";
import { getCategories } from "@/lib/api/categories";
import { getTags } from "@/lib/api/tags";
import type { Article, Category, Tag } from "@/lib/types";

interface SearchParams {
  category_id?: string;
  keyword?: string;
  page?: string;
}

export function ArticlesListContent() {
  const searchParams = useSearchParams();
  const params: SearchParams = {
    category_id: searchParams.get("category_id") ?? undefined,
    keyword: searchParams.get("keyword") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  };

  const currentPage = params.page ? Number(params.page) : 1;
  const activeCategoryId = params.category_id ?? "";
  const currentKeyword = params.keyword ?? "";

  const [loading, setLoading] = useState(true);
  const [articlesData, setArticlesData] = useState({
    list: [] as Article[],
    total_pages: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [hotArticles, setHotArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getArticles({
        category_id: params.category_id,
        keyword: params.keyword,
        page: currentPage,
        page_size: 12,
      }),
      getCategories(),
      getHotArticles(5),
      getTags(),
    ]).then(([articlesData, categories, hotArticles, tags]) => {
      if (cancelled) return;
      setArticlesData({ list: articlesData.list, total_pages: articlesData.total_pages });
      setCategories(categories);
      setHotArticles(hotArticles);
      setTags(tags);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category_id, params.keyword, params.page]);

  const articles = articlesData.list;

  return (
    <>
      {/* Category Filter */}
      <section className="sticky top-18 z-30 border-b border-border bg-background/95 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <Link
              href={buildHref({ category_id: "", keyword: currentKeyword })}
              className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                activeCategoryId === ""
                  ? "bg-ink text-accent"
                  : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent-hover"
              }`}
            >
              全部
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={buildHref({ category_id: category.id, keyword: currentKeyword })}
                className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                  activeCategoryId === category.id
                    ? "bg-ink text-accent"
                    : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent-hover"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Article List + Sidebar */}
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-72 animate-pulse rounded-radius-md bg-background-soft" />
                <div className="h-72 animate-pulse rounded-radius-md bg-background-soft" />
              </div>
              <div className="h-80 animate-pulse rounded-radius-md bg-background-soft" />
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {/* Main column */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {articlesData.total_pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={buildHref({ ...params, page: String(currentPage - 1) })}
                        className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                      >
                        上一页
                      </Link>
                    )}
                    <span className="px-4 text-sm text-text-muted">
                      {currentPage} / {articlesData.total_pages}
                    </span>
                    {currentPage < articlesData.total_pages && (
                      <Link
                        href={buildHref({ ...params, page: String(currentPage + 1) })}
                        className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                      >
                        下一页
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-8 lg:sticky lg:top-[128px] lg:self-start">
                {/* Hot Articles */}
                {hotArticles.length > 0 && (
                  <div className="rounded-radius-lg border border-border bg-surface p-5 shadow-card">
                    <h2 className="mb-4 flex items-center gap-2 font-display text-base text-text-primary">
                      <Flame className="h-4 w-4 text-tomato" strokeWidth={1.5} />
                      人气榜
                    </h2>
                    <ol className="space-y-4">
                      {hotArticles.map((article, index) => (
                        <li key={article.id}>
                          <Link
                            href={`/articles/${article.slug}`}
                            className="group flex items-start gap-3"
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-xs font-semibold ${
                                index < 3
                                  ? "bg-ink text-accent"
                                  : "bg-background-soft text-text-subtle"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="line-clamp-2 text-sm leading-snug text-text-secondary transition-colors duration-200 group-hover:text-accent-hover">
                                {article.title}
                              </span>
                              <span className="mt-1 flex items-center gap-1 text-xs text-text-subtle">
                                <Eye className="h-3 w-3" strokeWidth={1.5} />
                                {article.view_count}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Tag Cloud */}
                {tags.length > 0 && (
                  <div className="rounded-radius-lg border border-border bg-surface p-5 shadow-card">
                    <h2 className="mb-4 font-display text-base text-text-primary">
                      标签云
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/articles?keyword=${encodeURIComponent(tag.name)}`}
                          className="min-h-8 cursor-pointer rounded-full border border-border bg-background px-3 py-1 text-xs text-text-muted transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <CatFace className="h-14 w-14 -rotate-6 text-text-subtle" />
              <p className="mt-4 text-lg text-text-muted">
                {params.keyword
                  ? `未找到与「${params.keyword}」相关的动态`
                  : "该分类下暂无动态"}
              </p>
              <Link
                href="/articles"
                className="mt-4 cursor-pointer text-sm font-medium text-accent-hover transition-colors duration-200 ease-out hover:text-tomato"
              >
                查看全部动态
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function buildHref(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/articles?${qs}` : "/articles";
}
