"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Compass } from "lucide-react";
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
  }, [keyword, daysRange, sort, currentPage, refreshKey]);

  return (
    <>
      {/* 天数 / 排序筛选 chips */}
      <section className="sticky top-18 z-30 border-b border-border bg-background/95 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto md:flex-wrap md:justify-center">
            {DAYS_OPTIONS.map((option) => {
              const isActive = daysRange === option.value;
              return (
                <Link
                  key={option.value || "all"}
                  href={buildHref({ keyword, days_range: option.value, sort, page: "" })}
                  className={`min-h-9 shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-accent text-white"
                      : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
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
                  className={`min-h-8 shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-accent-subtle font-medium text-accent"
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
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-radius-md bg-surface"
                >
                  <div className="aspect-[16/10] bg-text-muted/10" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-32 rounded bg-text-muted/20" />
                    <div className="h-3 w-24 rounded bg-text-muted/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : data.failed ? (
            /* 错误重试态 */
            <ErrorState
              title="旅行攻略加载失败"
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
                      className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
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
                      className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                      下一页
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            /* 空状态 */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle">
                <Compass className="h-7 w-7 text-accent" strokeWidth={1.5} />
              </div>
              <p className="mt-6 font-heading text-xl text-text-secondary">
                {keyword
                  ? `未找到与「${keyword}」相关的攻略`
                  : "暂无旅行攻略，敬请期待"}
              </p>
              <Link
                href="/travels"
                className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
              >
                查看全部攻略
              </Link>
            </div>
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
