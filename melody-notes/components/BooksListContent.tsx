"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookCard } from "@/components/BookCard";
import { ErrorState, ListEmptyState } from "@/components/ErrorState";
import { getBooks } from "@/lib/api/books";
import type { Book } from "@/lib/types";

/** 阅读状态筛选项（value 为空表示全部） */
const READING_STATUS_OPTIONS = [
  { value: "", label: "全部" },
  { value: "want", label: "想读" },
  { value: "reading", label: "在读" },
  { value: "done", label: "读完" },
];

export function BooksListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const readingStatus = searchParams.get("reading_status") ?? "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [loading, setLoading] = useState(true);
  // 错误重试：递增该值重新触发取数
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState({
    list: [] as Book[],
    total: 0,
    total_pages: 0,
    failed: false,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBooks({
      keyword: keyword || undefined,
      reading_status: (readingStatus || undefined) as "want" | "reading" | "done" | undefined,
      page: currentPage,
      page_size: 12,
    }).then((res) => {
      if (cancelled) return;
      setData({
        list: res.list,
        total: res.total,
        total_pages: res.total_pages,
        failed: Boolean(res.failed),
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, readingStatus, currentPage, refreshKey]);

  /** 筛选链接：保留 keyword，切换阅读状态 / 页码 */
  const buildHref = (opts: { reading_status?: string; page?: number }) => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    const rs = opts.reading_status !== undefined ? opts.reading_status : readingStatus;
    if (rs) params.set("reading_status", rs);
    const p = opts.page ?? 1;
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/books?${qs}` : "/books";
  };

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-text-subtle">
          {keyword ? `“${keyword}” 的搜索结果：` : ""}共{" "}
          <span className="tabular-nums text-text-muted">{data.total}</span> 本
        </p>

        {/* 阅读状态筛选 */}
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
          {READING_STATUS_OPTIONS.map((option) => {
            const isActive = readingStatus === option.value;
            return (
              <Link
                key={option.value || "all"}
                href={buildHref({ reading_status: option.value, page: 1 })}
                className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                  isActive
                    ? "border-accent bg-accent-subtle text-accent"
                    : "border-border text-text-muted hover:border-accent/40 hover:text-text-primary"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>

        {loading ? (
          /* Skeleton 骨架屏 */
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-surface">
                <div className="aspect-[2/3] rounded-b-xl bg-surface-elevated" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-24 rounded bg-surface-elevated" />
                  <div className="h-3 w-16 rounded bg-surface-elevated" />
                </div>
              </div>
            ))}
          </div>
        ) : data.failed ? (
          /* 错误重试态 */
          <ErrorState
            title="书架加载失败"
            onRetry={() => setRefreshKey((k) => k + 1)}
          />
        ) : data.list.length === 0 ? (
          /* 虚线空状态 */
          <ListEmptyState
            message={keyword ? `没有找到与「${keyword}」相关的书籍，换个关键词试试` : "书架还空着，快去读点好书吧"}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {data.list.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* 分页 */}
            {data.total_pages > 1 && (
              <nav
                aria-label="书籍分页"
                className="mt-10 flex items-center justify-center gap-2"
              >
                {currentPage > 1 && (
                  <Link
                    href={buildHref({ page: currentPage - 1 })}
                    className="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border border-border px-3 text-sm text-text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent"
                  >
                    上一页
                  </Link>
                )}
                {Array.from({ length: data.total_pages }).map((_, i) => {
                  const p = i + 1;
                  if (data.total_pages > 7 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== data.total_pages) {
                    return p === 2 || p === data.total_pages - 1 ? (
                      <span key={p} className="px-1 text-text-subtle">
                        …
                      </span>
                    ) : null;
                  }
                  return (
                    <Link
                      key={p}
                      href={buildHref({ page: p })}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-sm tabular-nums transition-colors duration-200 ${
                        p === currentPage
                          ? "border-accent bg-accent-subtle text-accent"
                          : "border-border text-text-muted hover:border-accent/50 hover:text-accent"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
                {currentPage < data.total_pages && (
                  <Link
                    href={buildHref({ page: currentPage + 1 })}
                    className="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border border-border px-3 text-sm text-text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent"
                  >
                    下一页
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
