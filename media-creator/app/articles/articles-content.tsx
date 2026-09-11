"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FileText, Search, Eye, MessageCircle, X, Loader2 } from "lucide-react";
import { articles, categories, type PaginatedResponse, type Article, type Category } from "@/lib/api";
import { Pagination } from "@/components/pagination";

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

function filterByTag(list: Article[], tag?: string) {
  if (!tag) return list;
  return list.filter(
    (item) =>
      item.tag_names?.some((t) => t.toLowerCase().includes(tag.toLowerCase())) ||
      item.title.toLowerCase().includes(tag.toLowerCase()) ||
      item.summary.toLowerCase().includes(tag.toLowerCase())
  );
}

export function ArticlesContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const tag = searchParams.get("tag") || "";
  const categoryId = searchParams.get("category_id") || "";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 12;

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [res, setRes] = useState<PaginatedResponse<Article> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categories
      .list()
      .then(setCategoryList)
      .catch(() => setCategoryList([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    articles
      .list({
        page,
        page_size: pageSize,
        category_id: categoryId || undefined,
        keyword: keyword || (tag ? tag : undefined),
      })
      .then((data) => {
        if (!cancelled) {
          const filtered = tag ? filterByTag(data.list, tag) : data.list;
          setRes({ ...data, list: filtered });
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "加载失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [keyword, tag, categoryId, page]);

  const filteredList = res?.list || [];
  const totalPages = Math.max(1, Math.ceil((tag ? filteredList.length : res?.total || 0) / pageSize));

  const handlePageChange = (p: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(p));
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">文章动态</h1>
            <p className="mt-2 text-muted-foreground">阅读最新文章，探索创作背后的故事</p>
          </div>

          <form action="/articles" method="GET" className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="keyword"
                defaultValue={keyword}
                placeholder="搜索文章标题..."
                aria-label="搜索文章标题"
                className="w-full rounded-full border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full gradient-creator px-5 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              搜索
            </button>
          </form>
        </div>

        {/* Category filter */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link
            href="/articles"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
              !categoryId ? "gradient-creator" : "bg-card text-foreground border border-border hover:bg-muted"
            }`}
          >
            全部
          </Link>
          {categoryList.map((cat) => (
            <Link
              key={cat.id}
              href={`/articles?category_id=${cat.id}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                categoryId === cat.id
                  ? "gradient-creator"
                  : "bg-card text-foreground border border-border hover:bg-muted"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Active filters */}
        {(keyword || tag || categoryId) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">当前筛选：</span>
            {categoryId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                分类：{categoryList.find((c) => c.id === categoryId)?.name || categoryId}
                <Link href={`/articles${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""}`} className="rounded p-0.5 hover:bg-muted">
                  <X className="h-3 w-3" />
                </Link>
              </span>
            )}
            {tag && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                标签：{tag}
                <Link
                  href={`/articles${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""}`}
                  className="rounded p-0.5 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Link>
              </span>
            )}
            {keyword && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                关键词：{keyword}
                <Link
                  href={`/articles${categoryId ? `?category_id=${categoryId}` : tag ? `?tag=${encodeURIComponent(tag)}` : ""}`}
                  className="rounded p-0.5 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Link>
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            加载中...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl bg-card p-12 text-center text-destructive border border-border">
            {error}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-card p-12 text-center text-muted-foreground border border-border">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">暂无文章</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredList.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm border border-border transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {article.cover_image ? (
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {article.category_name && (
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {article.category_name}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{formatDate(article.published_at)}</span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.summary}</p>
                  {article.tag_names && article.tag_names.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {article.tag_names.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {article.view_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {article.comment_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
