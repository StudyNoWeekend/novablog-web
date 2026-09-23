"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Flame } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { formatViewCount } from "@/lib/format";
import { getArticles, getHotArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/categories";
import type { Article, Category } from "@/lib/types";

export function ArticlesListContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") ?? "";
  const keyword = searchParams.get("keyword") ?? "";
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const [loading, setLoading] = useState(true);
  const [articlesData, setArticlesData] = useState({
    list: [] as Article[],
    total: 0,
    total_pages: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [hotArticles, setHotArticles] = useState<Article[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getArticles({
        category_id: categoryId || undefined,
        keyword: keyword || undefined,
        page,
        page_size: 9,
      }),
      getCategories(),
      getHotArticles(5),
    ]).then(([articlesData, categories, hotArticles]) => {
      if (cancelled) return;
      setArticlesData({
        list: articlesData.list,
        total: articlesData.total,
        total_pages: articlesData.total_pages,
      });
      setCategories(categories);
      setHotArticles(hotArticles);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [categoryId, keyword, page]);

  /** 筛选链接：保留 keyword，切换 category / page */
  const buildHref = (opts: { category_id?: string; page?: number }) => {
    const params = new URLSearchParams();
    const cid = opts.category_id !== undefined ? opts.category_id : categoryId;
    if (cid) params.set("category_id", cid);
    if (keyword) params.set("keyword", keyword);
    const p = opts.page ?? 1;
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/articles?${qs}` : "/articles";
  };

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-8">
        {/* 主栏 */}
        <div className="min-w-0 lg:col-span-2">
          {/* 分类筛选 */}
          {categories.length > 0 && (
            <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
              <Link
                href={buildHref({ category_id: "", page: 1 })}
                className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                  !categoryId
                    ? "border-accent bg-accent-subtle text-accent"
                    : "border-border text-text-muted hover:border-accent/40 hover:text-text-primary"
                }`}
              >
                全部
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={buildHref({ category_id: c.id, page: 1 })}
                  className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                    categoryId === c.id
                      ? "border-accent bg-accent-subtle text-accent"
                      : "border-border text-text-muted hover:border-accent/40 hover:text-text-primary"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          <p className="mb-6 text-sm text-text-subtle">
            {keyword ? `“${keyword}” 的搜索结果：` : ""}共{" "}
            <span className="tabular-nums text-text-muted">{articlesData.total}</span> 篇文章
          </p>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-surface">
                  <div className="aspect-[16/10] rounded-t-xl bg-surface-elevated" />
                  <div className="space-y-2 p-5">
                    <div className="h-4 w-3/4 rounded bg-surface-elevated" />
                    <div className="h-3 w-full rounded bg-surface-elevated" />
                  </div>
                </div>
              ))}
            </div>
          ) : articlesData.list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center text-sm text-text-muted">
              {keyword ? "没有找到相关文章，换个关键词试试" : "还没有发布文章"}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {articlesData.list.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* 分页 */}
          {!loading && articlesData.total_pages > 1 && (
            <nav
              aria-label="文章分页"
              className="mt-10 flex items-center justify-center gap-2"
            >
              {page > 1 && (
                <Link
                  href={buildHref({ page: page - 1 })}
                  className="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border border-border px-3 text-sm text-text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent"
                >
                  上一页
                </Link>
              )}
              {Array.from({ length: articlesData.total_pages }).map((_, i) => {
                const p = i + 1;
                if (articlesData.total_pages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== articlesData.total_pages) {
                  return p === 2 || p === articlesData.total_pages - 1 ? (
                    <span key={p} className="px-1 text-text-subtle">
                      …
                    </span>
                  ) : null;
                }
                return (
                  <Link
                    key={p}
                    href={buildHref({ page: p })}
                    aria-current={p === page ? "page" : undefined}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-sm tabular-nums transition-colors duration-200 ${
                      p === page
                        ? "border-accent bg-accent-subtle text-accent"
                        : "border-border text-text-muted hover:border-accent/50 hover:text-accent"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
              {page < articlesData.total_pages && (
                <Link
                  href={buildHref({ page: page + 1 })}
                  className="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border border-border px-3 text-sm text-text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent"
                >
                  下一页
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* 侧栏 */}
        <aside className="min-w-0 space-y-6">
          {/* 热门文章 */}
          <section
            aria-labelledby="hot-articles-title"
            className="rounded-xl border border-border bg-surface p-5 shadow-card"
          >
            <h2 id="hot-articles-title" className="flex items-center gap-1.5 text-base font-bold text-text-primary">
              <Flame className="h-4 w-4 text-accent" strokeWidth={1.5} />
              热门文章
            </h2>
            {hotArticles.length === 0 ? (
              <p className="mt-4 text-sm text-text-subtle">暂无数据</p>
            ) : (
              <ol className="mt-3 divide-y divide-border">
                {hotArticles.map((article, i) => (
                  <li key={article.id}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="group flex cursor-pointer items-baseline gap-3 py-3"
                    >
                      <span className="font-[var(--font-script)] text-xl leading-none text-accent/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm text-text-primary transition-colors duration-200 group-hover:text-accent">
                          {article.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-text-subtle">
                          {formatViewCount(article.view_count)} 次阅读
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* 标签云 */}
          {categories.length > 0 && (
            <section
              aria-labelledby="side-categories-title"
              className="rounded-xl border border-border bg-surface p-5 shadow-card"
            >
              <h2 id="side-categories-title" className="text-base font-bold text-text-primary">
                分类
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={buildHref({ category_id: c.id, page: 1 })}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors duration-200 ${
                      categoryId === c.id
                        ? "border-accent bg-accent-subtle text-accent"
                        : "border-border text-text-muted hover:border-accent/40 hover:text-accent"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}
