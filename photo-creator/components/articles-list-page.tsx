"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, Tag } from "lucide-react";
import { articles, categories, Article, Category } from "@/lib/api";
import { ArticleCard } from "./article-card";
import { CategoryFilter } from "./category-filter";
import { Pagination } from "./pagination";
import { ErrorState, EmptyState } from "./error-state";
import { ArticleGridSkeleton } from "./loading";
import Link from "next/link";

const PAGE_SIZE = 9;

function filterByTag(list: Article[], tag?: string) {
  if (!tag) return list;
  return list.filter((item) => item.tag_names?.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

export function ArticlesListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = searchParams.get("category_id") || undefined;
  const keyword = searchParams.get("keyword") || "";
  const tag = searchParams.get("tag") || "";

  const [rawItems, setRawItems] = useState<Article[]>([]);
  const [rawTotalPages, setRawTotalPages] = useState(0);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const load = async (currentPage: number, cat?: string, kw?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [a, c] = await Promise.all([
        articles.list({
          page: tag ? 1 : currentPage,
          page_size: tag ? 100 : PAGE_SIZE,
          category_id: cat,
          keyword: kw || undefined,
        }),
        categories.list().catch(() => [] as Category[]),
      ]);
      setRawItems(a.list);
      setRawTotalPages(a.total_pages);
      setCategoriesList(c);
      if (!tag && currentPage > a.total_pages && a.total_pages > 0) {
        setPage(a.total_pages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载文章失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    load(1, categoryId, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, keyword, tag]);

  useEffect(() => {
    load(page, categoryId, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const updateQuery = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (id?: string) => {
    updateQuery({ category_id: id });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ keyword: searchValue.trim() || undefined });
  };

  const filteredItems = useMemo(() => filterByTag(rawItems, tag), [rawItems, tag]);
  const totalPages = tag ? Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE)) : rawTotalPages;
  const pagedItems = useMemo(() => {
    if (!tag) return filteredItems;
    const start = (page - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, tag, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
      <div className="mb-10 md:mb-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">02 日志</p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          {tag ? `标签：${tag}` : "文章"}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">摄影技巧、创作心得与视觉故事。</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CategoryFilter categories={categoriesList} selectedId={categoryId} onSelect={handleCategoryChange} />
        <form onSubmit={handleSearchSubmit} className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索文章标题"
            aria-label="搜索文章标题"
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </form>
      </div>

      {(keyword || tag) && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">当前筛选：</span>
          {tag && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-foreground">
              <Tag className="size-3" />
              {tag}
              <Link
                href={`${pathname}${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""}`}
                className="rounded p-0.5 transition-colors hover:bg-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}
          {keyword && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-foreground">
              关键词：{keyword}
              <Link
                href={`${pathname}${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`}
                className="rounded p-0.5 transition-colors hover:bg-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}
        </div>
      )}

      {loading ? (
        <ArticleGridSkeleton count={9} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(page, categoryId, keyword)} />
      ) : pagedItems.length === 0 ? (
        <EmptyState title="暂无文章" description="没有找到匹配的文章" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pagedItems.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
