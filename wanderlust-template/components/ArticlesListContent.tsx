"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { HotArticles } from "@/components/HotArticles";
import { getArticles, getHotArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/categories";
import { getTags } from "@/lib/api/tags";
import type { Article, Category, Tag } from "@/lib/types";

interface ListResult {
  key: string;
  articles: Article[];
  totalPages: number;
  categories: Category[];
  hotArticles: Article[];
  tags: Tag[];
}

export function ArticlesListContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") ?? "";
  const keyword = searchParams.get("keyword") ?? "";
  const page = searchParams.get("page") ?? "1";
  const currentPage = Number(page) || 1;

  // 以查询参数组合为 key：结果不匹配当前 key 时自动呈现加载态（避免在 effect 内同步 setState）
  const resultKey = useMemo(
    () => `${categoryId}|${keyword}|${currentPage}`,
    [categoryId, keyword, currentPage]
  );

  const [result, setResult] = useState<ListResult | null>(null);
  const loading = result === null || result.key !== resultKey;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getArticles({
        category_id: categoryId || undefined,
        keyword: keyword || undefined,
        page: currentPage,
        page_size: 12,
      }),
      getCategories(),
      getHotArticles(5),
      getTags(),
    ]).then(([articlesData, categories, hotArticles, tags]) => {
      if (cancelled) return;
      setResult({
        key: resultKey,
        articles: articlesData.list,
        totalPages: articlesData.total_pages,
        categories,
        hotArticles,
        tags,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [resultKey, categoryId, keyword, currentPage]);

  const articles = result?.key === resultKey ? result.articles : [];
  const categories = result?.key === resultKey ? result.categories : [];
  const hotArticles = result?.key === resultKey ? result.hotArticles : [];
  const tags = result?.key === resultKey ? result.tags : [];
  const totalPages = result?.key === resultKey ? result.totalPages : 0;

  return (
    <>
      {/* Category Filter */}
      <section className="sticky top-18 z-30 border-b border-border bg-background/95 py-4 backdrop-blur-md">
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 sm:px-6 lg:flex-wrap lg:justify-center lg:px-8">
          <Link
            href={buildHref({ category_id: "", keyword })}
            className={`min-h-9 shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              categoryId === ""
                ? "bg-accent text-white"
                : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
            }`}
          >
            全部
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildHref({ category_id: category.id, keyword })}
              className={`min-h-9 shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                categoryId === category.id
                  ? "bg-accent text-white"
                  : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Article List + Sidebar */}
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-72 animate-pulse rounded-radius-lg bg-surface" />
                <div className="h-72 animate-pulse rounded-radius-lg bg-surface" />
              </div>
              <div className="h-80 animate-pulse rounded-radius-lg bg-surface" />
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {/* Main column */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={buildHref({ category_id: categoryId, keyword, page: String(currentPage - 1) })}
                        className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                      >
                        上一页
                      </Link>
                    )}
                    <span className="px-4 text-sm text-text-muted">
                      {currentPage} / {totalPages}
                    </span>
                    {currentPage < totalPages && (
                      <Link
                        href={buildHref({ category_id: categoryId, keyword, page: String(currentPage + 1) })}
                        className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                      >
                        下一页
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-8 lg:sticky lg:top-36 lg:self-start">
                <HotArticles articles={hotArticles} />

                {/* Tag Cloud */}
                {tags.length > 0 && (
                  <div className="rounded-radius-lg border border-border bg-surface p-5 shadow-card">
                    <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-text-primary">
                      标签云
                      <span className="font-hand text-base font-medium text-accent/70">
                        Tags
                      </span>
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/articles?keyword=${encodeURIComponent(tag.name)}`}
                          className="min-h-8 cursor-pointer rounded-full border border-border bg-background-soft px-3 py-1 text-xs text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                        >
                          # {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-display text-xl text-text-secondary">
                {keyword
                  ? `未找到与「${keyword}」相关的游记`
                  : "该分类下暂无游记"}
              </p>
              <p className="mt-2 flex items-center gap-1 text-sm text-text-muted">
                换个关键词试试
                <Heart className="h-3.5 w-3.5 text-flame" strokeWidth={1.6} />
              </p>
              <Link
                href="/articles"
                className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
              >
                查看全部游记
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
