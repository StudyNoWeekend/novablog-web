"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TravelCard } from "@/components/TravelCard";
import { ErrorState, ListEmptyState } from "@/components/ErrorState";
import { getTravels } from "@/lib/api/travels";
import type { TravelGuide } from "@/lib/types";

/** 天数区间筛选项（value 为空表示全部） */
const DAYS_OPTIONS = [
  { value: "", label: "全部天数" },
  { value: "1-3", label: "1-3 天" },
  { value: "4-7", label: "4-7 天" },
  { value: "8-14", label: "8-14 天" },
  { value: "15+", label: "15 天以上" },
];

/** 排序选项 */
const SORT_OPTIONS = [
  { value: "", label: "默认排序" },
  { value: "views", label: "最多浏览" },
  { value: "rating", label: "最高评分" },
  { value: "likes", label: "最多点赞" },
];

export function TravelsListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const daysRange = searchParams.get("days_range") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [loading, setLoading] = useState(true);
  // 错误重试：递增该值重新触发取数
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState({
    list: [] as TravelGuide[],
    total_pages: 0,
    failed: false,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTravels({
      keyword: keyword || undefined,
      days_range: daysRange,
      sort: sort || undefined,
      page: currentPage,
      page_size: 12,
    }).then((res) => {
      if (cancelled) return;
      setData({
        list: res.list,
        total_pages: res.total_pages,
        failed: Boolean(res.failed),
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, daysRange, sort, currentPage, refreshKey]);

  return (
    <>
      {/* 天数 / 排序筛选 */}
      <section className="border-b border-border bg-background/95 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 sm:px-6 lg:px-8">
          <div className="no-scrollbar flex items-center justify-start gap-2 overflow-x-auto lg:justify-center">
            {DAYS_OPTIONS.map((option) => {
              const isActive = daysRange === option.value;
              return (
                <Link
                  key={option.value || "all"}
                  href={buildHref({ keyword, days_range: option.value, sort, page: "" })}
                  className={`min-h-9 shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-gradient-theme text-white shadow-glow"
                      : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent-hover"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
          <div className="no-scrollbar flex items-center justify-start gap-2 overflow-x-auto lg:justify-center">
            {SORT_OPTIONS.map((option) => {
              const isActive = sort === option.value;
              return (
                <Link
                  key={option.value || "default"}
                  href={buildHref({ keyword, days_range: daysRange, sort: option.value, page: "" })}
                  className={`min-h-8 shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-accent-subtle font-semibold text-accent-hover"
                      : "text-text-subtle hover:text-text-primary"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 攻略列表 */}
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            /* Skeleton 骨架屏 */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-radius-md bg-surface"
                >
                  <div className="aspect-[16/9] bg-surface-highlight" />
                  <div className="space-y-2 p-5">
                    <div className="h-4 w-3/4 rounded bg-surface-highlight" />
                    <div className="h-3 w-1/2 rounded bg-surface" />
                  </div>
                </div>
              ))}
            </div>
          ) : data.failed ? (
            /* 错误重试态 */
            <ErrorState
              title="攻略加载失败"
              onRetry={() => setRefreshKey((k) => k + 1)}
            />
          ) : data.list.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.list.map((travel) => (
                  <TravelCard key={travel.id} travel={travel} />
                ))}
              </div>

              {/* 分页 */}
              {data.total_pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={buildHref({ keyword, days_range: daysRange, sort, page: String(currentPage - 1) })}
                      className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                    >
                      上一页
                    </Link>
                  )}
                  <span className="px-4 text-sm text-text-muted">
                    {currentPage} / {data.total_pages}
                  </span>
                  {currentPage < data.total_pages && (
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
            /* 虚线空状态 */
            <ListEmptyState
              message={keyword ? `未找到与「${keyword}」相关的攻略` : "暂无旅行攻略，敬请期待"}
            />
          )}
        </div>
      </section>
    </>
  );
}

/** 组装列表页查询参数（空值不写入） */
function buildHref(params: Record<string, string>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/travels?${qs}` : "/travels";
}
