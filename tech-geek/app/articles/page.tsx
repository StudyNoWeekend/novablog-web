"use client";

import { useEffect, useState, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Folder, Tag } from "lucide-react";
import { articles, categories, Article, Category, PaginatedResponse } from "@/lib/api";
import { ArticleCard } from "@/components/article-card";
import { Pagination } from "@/components/pagination";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

function filterByTag(list: Article[], tag?: string) {
  if (!tag) return list;
  return list.filter((item) => item.tag_names?.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

function ArticlesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get("category_id") || undefined;
  const keyword = searchParams.get("keyword") || "";
  const tag = searchParams.get("tag") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [result, setResult] = useState<PaginatedResponse<Article> | null>(null);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const buildUrl = useCallback(
    (params: { category_id?: string; keyword?: string; tag?: string; page?: number }) => {
      const sp = new URLSearchParams();
      if (params.category_id) sp.set("category_id", params.category_id);
      if (params.keyword) sp.set("keyword", params.keyword);
      if (params.tag) sp.set("tag", params.tag);
      if (params.page && params.page > 1) sp.set("page", String(params.page));
      const query = sp.toString();
      return `/articles${query ? `?${query}` : ""}`;
    },
    []
  );

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const [res, cats] = await Promise.all([
        articles.list({
          page: tag ? 1 : page,
          page_size: tag ? 100 : PAGE_SIZE,
          category_id: categoryId,
          keyword: keyword || undefined,
        }),
        categories.list(),
      ]);
      setResult(res);
      setCategoryList(cats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载文章失败");
    } finally {
      setLoading(false);
    }
  }, [page, categoryId, keyword, tag]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ category_id: categoryId, keyword: searchValue.trim(), tag, page: 1 }));
  };

  const currentCategory = categoryList.find((c) => c.id === categoryId);

  const filteredList = useMemo(() => filterByTag(result?.list || [], tag), [result, tag]);
  const totalItems = tag ? filteredList.length : result?.total ?? 0;
  const totalPages = tag ? Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE)) : result?.total_pages ?? 1;
  const pagedList = useMemo(() => {
    if (!tag) return filteredList;
    const start = (page - 1) * PAGE_SIZE;
    return filteredList.slice(start, start + PAGE_SIZE);
  }, [filteredList, tag, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {currentCategory ? currentCategory.name : tag ? `标签：${tag}` : "全部文章"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            共 {totalItems} 篇文章
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full gap-2 md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索文章标题..."
              className="pl-9"
              aria-label="搜索文章"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  router.push(buildUrl({ category_id: categoryId, tag, page: 1 }));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="清空搜索"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" className="cursor-pointer">
            搜索
          </Button>
        </form>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href={buildUrl({ keyword, tag, page: 1 })}
          className={`inline-flex h-5 items-center gap-1 rounded-4xl px-2 py-0.5 text-xs font-medium transition-colors ${
            !categoryId
              ? "bg-primary text-primary-foreground"
              : "border border-border text-muted-foreground hover:text-primary"
          }`}
        >
          全部
        </Link>
        {categoryList.map((category) => (
          <Link
            key={category.id}
            href={buildUrl({ category_id: category.id, keyword, tag, page: 1 })}
            className={`inline-flex h-5 items-center gap-1 rounded-4xl px-2 py-0.5 text-xs font-medium transition-colors ${
              categoryId === category.id
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-primary"
            }`}
          >
            <Folder className="h-3 w-3" />
            {category.name}
          </Link>
        ))}
      </div>

      {/* Active filters */}
      {(keyword || tag) && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">当前筛选：</span>
          {categoryId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              分类：{categoryList.find((c) => c.id === categoryId)?.name || categoryId}
              <Link href={buildUrl({ keyword, tag, page: 1 })} className="rounded p-0.5 hover:bg-muted">
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}
          {tag && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              <Tag className="h-3 w-3" />
              {tag}
              <Link href={buildUrl({ category_id: categoryId, keyword, page: 1 })} className="rounded p-0.5 hover:bg-muted">
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}
          {keyword && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              关键词：{keyword}
              <Link href={buildUrl({ category_id: categoryId, tag, page: 1 })} className="rounded p-0.5 hover:bg-muted">
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}
        </div>
      )}

      {loading ? (
        <Loading text="加载文章中..." />
      ) : error ? (
        <ErrorState title="文章加载失败" message={error} onRetry={fetchArticles} />
      ) : pagedList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的文章
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pagedList.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} baseUrl={buildUrl({ category_id: categoryId, keyword, tag })} />
          </div>
        </>
      )}
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<Loading text="加载中..." />}>
      <ArticlesPageContent />
    </Suspense>
  );
}
