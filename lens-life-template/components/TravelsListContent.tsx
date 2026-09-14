"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TravelCard } from "@/components/TravelCard";
import { getTravels } from "@/lib/api/travels";
import type { TravelGuide } from "@/lib/types";

interface SearchParams {
  keyword?: string;
  days_range?: string;
  sort?: string;
  page?: string;
}

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
  const params: SearchParams = {
    keyword: searchParams.get("keyword") ?? undefined,
    days_range: searchParams.get("days_range") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  };

  const currentPage = params.page ? Number(params.page) : 1;
  const activeDays = params.days_range ?? "";
  const activeSort = params.sort ?? "";

  const [loading, setLoading] = useState(true);
  const [travelsData, setTravelsData] = useState({
    list: [] as TravelGuide[],
    total_pages: 0,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTravels({
      keyword: params.keyword,
      days_range: activeDays,
      sort: activeSort,
      page: currentPage,
      page_size: 12,
    }).then((data) => {
      if (cancelled) return;
      setTravelsData({ list: data.list, total_pages: data.total_pages });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.keyword, params.days_range, params.sort, params.page]);

  const travels = travelsData.list;

  return (
    <>
      {/* Filters */}
      <section className="border-b border-border bg-background/95 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {DAYS_OPTIONS.map((option) => {
              const isActive = activeDays === option.value;
              return (
                <Link
                  key={option.value || "all"}
                  href={buildHref({ ...params, days_range: option.value, page: "" })}
                  className={`min-h-9 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-accent text-background"
                      : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SORT_OPTIONS.map((option) => {
              const isActive = activeSort === option.value;
              return (
                <Link
                  key={option.value || "default"}
                  href={buildHref({ ...params, sort: option.value, page: "" })}
                  className={`min-h-9 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-accent-subtle text-accent"
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

      {/* Travel List */}
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="h-72 animate-pulse rounded-radius-md bg-surface" />
              <div className="h-72 animate-pulse rounded-radius-md bg-surface" />
            </div>
          ) : travels.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {travels.map((travel) => (
                  <TravelCard key={travel.id} travel={travel} />
                ))}
              </div>

              {/* Pagination */}
              {travelsData.total_pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={buildHref({ ...params, page: String(currentPage - 1) })}
                      className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                      上一页
                    </Link>
                  )}
                  <span className="px-4 text-sm text-text-muted">
                    {currentPage} / {travelsData.total_pages}
                  </span>
                  {currentPage < travelsData.total_pages && (
                    <Link
                      href={buildHref({ ...params, page: String(currentPage + 1) })}
                      className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                      下一页
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg text-text-muted">
                {params.keyword
                  ? `未找到与「${params.keyword}」相关的攻略`
                  : "暂无旅行攻略，敬请期待"}
              </p>
              <Link
                href="/travels"
                className="mt-4 cursor-pointer text-sm font-medium text-accent transition-colors duration-200 ease-out hover:text-accent-hover"
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

function buildHref(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/travels?${qs}` : "/travels";
}
