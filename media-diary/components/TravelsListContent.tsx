"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TravelCard } from "@/components/TravelCard";
import { ErrorState } from "@/components/ErrorState";
import { getTravels } from "@/lib/api/travels";
import type { TravelGuide } from "@/lib/types";

const DAYS_OPTIONS = [
  { value: "", label: "全部天数" },
  { value: "1-3", label: "1-3 天" },
  { value: "4-7", label: "4-7 天" },
  { value: "8-14", label: "8-14 天" },
  { value: "15+", label: "15 天以上" },
];

const SORT_OPTIONS = [
  { value: "", label: "默认排序" },
  { value: "views", label: "最多浏览" },
  { value: "rating", label: "最高评分" },
  { value: "likes", label: "最多点赞" },
];

interface ListResult {
  key: string;
  travels: TravelGuide[];
  totalPages: number;
  failed: boolean;
}

/** 旅行攻略列表（客户端按 searchParams 取数）：天数/排序筛选 + 卡片网格 + 分页 */
export function TravelsListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const daysRange = searchParams.get("days_range") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const page = searchParams.get("page") ?? "1";
  const currentPage = Number(page) || 1;
  const [retryCount, setRetryCount] = useState(0);

  // 以查询参数组合为 key：结果不匹配当前 key 时自动呈现加载态（避免在 effect 内同步 setState）
  const resultKey = useMemo(
    () => `${keyword}|${daysRange}|${sort}|${currentPage}|${retryCount}`,
    [keyword, daysRange, sort, currentPage, retryCount]
  );

  const [result, setResult] = useState<ListResult | null>(null);
  const loading = result === null || result.key !== resultKey;

  useEffect(() => {
    let cancelled = false;
    getTravels({
      keyword: keyword || undefined,
      days_range: daysRange,
      sort: sort || undefined,
      page: currentPage,
      page_size: 12,
    }).then((data) => {
      if (cancelled) return;
      setResult({
        key: resultKey,
        travels: data.list,
        totalPages: data.total_pages,
        failed: Boolean(data.failed),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [resultKey, keyword, daysRange, sort, currentPage]);

  const travels = result?.key === resultKey ? result.travels : [];
  const totalPages = result?.key === resultKey ? result.totalPages : 0;
  const failed = result?.key === resultKey ? result.failed : false;

  if (failed) {
    return (
      <ErrorState onRetry={() => setRetryCount((prev) => prev + 1)} />
    );
  }

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-10 flex flex-col gap-3">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto md:flex-wrap md:justify-center">
            {DAYS_OPTIONS.map((option) => {
              const isActive = daysRange === option.value;
              return (
                <Link
                  key={option.value || "all"}
                  href={buildHref({ keyword, days_range: option.value, sort, page: "" })}
                  className={`min-h-9 shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-accent text-ink"
                      : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent-hover"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto md:flex-wrap md:justify-center">
            {SORT_OPTIONS.map((option) => {
              const isActive = sort === option.value;
              return (
                <Link
                  key={option.value || "default"}
                  href={buildHref({ keyword, days_range: daysRange, sort: option.value, page: "" })}
                  className={`min-h-8 shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs transition-colors duration-200 ${
                    isActive
                      ? "bg-accent-subtle font-medium text-accent-hover"
                      : "text-text-subtle hover:text-text-primary"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[16/10] animate-pulse rounded-xl bg-surface"
              />
            ))}
          </div>
        ) : travels.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {travels.map((travel) => (
                <TravelCard key={travel.id} travel={travel} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildHref({ keyword, days_range: daysRange, sort, page: String(currentPage - 1) })}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                  >
                    上一页
                  </Link>
                )}
                <span className="px-4 font-hand text-lg text-text-muted">
                  {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={buildHref({ keyword, days_range: daysRange, sort, page: String(currentPage + 1) })}
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
            <p className="font-hand text-3xl text-text-subtle">on the road…</p>
            <p className="mt-2 text-lg text-text-muted">
              {keyword
                ? `未找到与「${keyword}」相关的旅行攻略`
                : "暂无旅行攻略，敬请期待"}
            </p>
            <Link
              href="/travels"
              className="mt-4 cursor-pointer text-sm font-medium text-accent-hover transition-colors duration-200 ease-out hover:text-accent"
            >
              查看全部攻略
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function buildHref(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/travels?${qs}` : "/travels";
}
