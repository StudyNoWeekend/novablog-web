"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, ChefHat, Eye } from "lucide-react";
import { getArticles } from "@/lib/api/articles";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/format";

/**
 * 菜谱分享：与「美食日记」同源的文章数据，以菜谱卡片的形制呈现
 * （大图封面 + hover 浮层展示摘要），分页通过 searchParams 驱动。
 */
export function RecipesListContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? "1") || 1;

  const [loading, setLoading] = useState(true);
  const [articlesData, setArticlesData] = useState({
    list: [] as Article[],
    total_pages: 0,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getArticles({ page: currentPage, page_size: 12 }).then((data) => {
      if (cancelled) return;
      setArticlesData({ list: data.list, total_pages: data.total_pages });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const articles = articlesData.list;

  const buildHref = (page: number) =>
    page > 1 ? `/recipes?page=${page}` : "/recipes";

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3.6] animate-pulse rounded-lg bg-surface"
              />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <RecipeCard key={article.id} article={article} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {articlesData.total_pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildHref(currentPage - 1)}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                  >
                    上一页
                  </Link>
                )}
                <span className="px-4 font-hand text-lg text-text-muted">
                  {currentPage} / {articlesData.total_pages}
                </span>
                {currentPage < articlesData.total_pages && (
                  <Link
                    href={buildHref(currentPage + 1)}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                  >
                    下一页
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-hand text-3xl text-text-subtle">recipe book is empty…</p>
            <p className="mt-2 text-lg text-text-muted">菜谱正在编写中，敬请期待</p>
            <Link
              href="/articles"
              className="mt-4 cursor-pointer text-sm font-medium text-accent-hover transition-colors duration-200 ease-out hover:text-accent"
            >
              先去看看美食日记
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function RecipeCard({ article, index }: { article: Article; index: number }) {
  const dateStr = formatDate(article.published_at || article.created_at);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group relative flex aspect-[4/3.6] cursor-pointer flex-col justify-end overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Cover */}
      {article.cover_image ? (
        <Image
          src={article.cover_image}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-background-soft">
          <ChefHat className="h-10 w-10 text-text-subtle" strokeWidth={1.2} />
        </div>
      )}

      {/* Hover 渐变浮层 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

      {/* 菜谱编号角标 */}
      <span
        aria-hidden="true"
        className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 font-hand text-xl leading-none text-accent-hover shadow-card"
      >
        {index + 1}
      </span>
      {article.category_name && (
        <span className="absolute right-4 top-4 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-white shadow-card">
          {article.category_name}
        </span>
      )}

      {/* Bottom info */}
      <div className="relative z-10 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-white">
          {article.title}
        </h3>
        <p className="mt-2 hidden text-sm leading-relaxed text-white/85 sm:line-clamp-2">
          {article.summary}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-white/70">
          {dateStr && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
              {dateStr}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
            {article.view_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
