"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookOpen, Loader2, Search } from "lucide-react";
import { books, moduleConfig, ALL_ENABLED, type PaginatedResponse, type Book } from "@/lib/api";
import { BookCard } from "@/components/book-card";
import { Pagination } from "@/components/pagination";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";

const PAGE_SIZE = 12;

/** 阅读状态筛选选项（后端 reading_status：want|reading|done，all 或空=全部） */
const READING_STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "want", label: "想读" },
  { value: "reading", label: "在读" },
  { value: "done", label: "读完" },
];

export function BooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const readingStatus = searchParams.get("reading_status") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [res, setRes] = useState<PaginatedResponse<Book> | null>(null);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    books
      .list({
        page,
        page_size: PAGE_SIZE,
        keyword: keyword || undefined,
        reading_status: readingStatus || "all",
      })
      .then((data) => {
        if (!cancelled) {
          setRes(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "加载失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    // 客户端复核模块开关（失败按开启处理，取 ALL_ENABLED 兜底）
    moduleConfig
      .get()
      .then((config) => {
        if (!cancelled) setModuleEnabled(config.book_enabled);
      })
      .catch(() => {
        if (!cancelled) setModuleEnabled(ALL_ENABLED.book_enabled);
      });
    return () => {
      cancelled = true;
    };
  }, [keyword, readingStatus, page, reloadKey]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const buildUrl = (params: { keyword?: string; reading_status?: string; page?: number }) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (params.keyword !== undefined) {
      if (params.keyword) sp.set("keyword", params.keyword);
      else sp.delete("keyword");
    }
    if (params.reading_status !== undefined) {
      if (params.reading_status) sp.set("reading_status", params.reading_status);
      else sp.delete("reading_status");
    }
    if (params.page !== undefined) {
      if (params.page > 1) sp.set("page", String(params.page));
      else sp.delete("page");
    }
    const query = sp.toString();
    return `/books${query ? `?${query}` : ""}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    router.push(buildUrl({ reading_status: value, page: 1 }));
  };

  const handlePageChange = (p: number) => {
    router.push(buildUrl({ page: p }));
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="读书书架" />;
  }

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-hand text-3xl text-foreground sm:text-4xl">读书书架</h1>
            <p className="mt-2 text-muted-foreground">读过的书，都藏在镜头背后的故事里</p>
          </div>

          <div className="flex w-full max-w-lg items-center gap-2">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索书名、作者..."
                aria-label="搜索书籍"
                className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </form>
            <select
              value={readingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              aria-label="阅读状态筛选"
              className="h-11 cursor-pointer rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              {READING_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            加载中...
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title="书架加载失败"
              message={error}
              onRetry={() => setReloadKey((k) => k + 1)}
            />
          </div>
        ) : !res || res.list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">没有找到符合条件的书籍</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {res.list.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            {res.total_pages > 1 && (
              <div className="mt-10">
                <Pagination page={page} totalPages={res.total_pages} onPageChange={handlePageChange} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
