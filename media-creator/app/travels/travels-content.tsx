"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Map } from "lucide-react";
import { travels, type PaginatedResponse, type TravelGuide } from "@/lib/api";
import { TravelCard } from "@/components/travel-card";
import { Pagination } from "@/components/pagination";
import { ErrorState } from "@/components/error-state";

const PAGE_SIZE = 12;

/** 天数范围筛选（后端 days_range：如 1-3 / 4-7 / 8-14 / 15+） */
const DAYS_OPTIONS = [
  { value: "", label: "全部天数" },
  { value: "1-3", label: "1-3 天" },
  { value: "4-7", label: "4-7 天" },
  { value: "8-14", label: "8-14 天" },
  { value: "15+", label: "15 天以上" },
];

/** 排序选项（后端 sort：views/rating/likes，缺省为默认排序） */
const SORT_OPTIONS = [
  { value: "", label: "默认排序" },
  { value: "views", label: "最多浏览" },
  { value: "rating", label: "最高评分" },
  { value: "likes", label: "最多点赞" },
];

export function TravelsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const daysRange = searchParams.get("days_range") || "";
  const sort = searchParams.get("sort") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [res, setRes] = useState<PaginatedResponse<TravelGuide> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    travels
      .list({
        page,
        page_size: PAGE_SIZE,
        keyword: keyword || undefined,
        days_range: daysRange || undefined,
        sort: sort || undefined,
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
    return () => {
      cancelled = true;
    };
  }, [keyword, daysRange, sort, page, reloadKey]);

  const buildUrl = (params: { days_range?: string; sort?: string; page?: number }) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (params.days_range !== undefined) {
      if (params.days_range) sp.set("days_range", params.days_range);
      else sp.delete("days_range");
    }
    if (params.sort !== undefined) {
      if (params.sort) sp.set("sort", params.sort);
      else sp.delete("sort");
    }
    if (params.page !== undefined) {
      if (params.page > 1) sp.set("page", String(params.page));
      else sp.delete("page");
    }
    const query = sp.toString();
    return `/travels${query ? `?${query}` : ""}`;
  };

  const handlePageChange = (p: number) => {
    router.push(buildUrl({ page: p }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* 天数 / 排序筛选 chips（Link 切换，保留关键词） */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {DAYS_OPTIONS.map((option) => {
            const active = daysRange === option.value;
            return (
              <Link
                key={option.value || "all-days"}
                href={buildUrl({ days_range: option.value, page: 1 })}
                className={`inline-flex min-h-9 cursor-pointer items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-input bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SORT_OPTIONS.map((option) => {
            const active = sort === option.value;
            return (
              <Link
                key={option.value || "default-sort"}
                href={buildUrl({ sort: option.value, page: 1 })}
                className={`inline-flex min-h-8 cursor-pointer items-center rounded-full px-3 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "bg-secondary font-medium text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>

      {keyword && !loading && (
        <div className="mt-4 text-sm text-muted-foreground">
          {res && res.total > 0
            ? `找到 ${res.total} 篇与 "${keyword}" 相关的攻略`
            : `未找到与 "${keyword}" 相关的攻略`}
        </div>
      )}

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[16/10] animate-pulse bg-muted" />
              <div className="p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-8">
          <ErrorState
            title="攻略加载失败"
            message={error}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        </div>
      ) : !res || res.list.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Map className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4">没有找到符合条件的攻略</p>
          <Link
            href="/travels"
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            查看全部攻略
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {res.list.map((travel, i) => (
              <TravelCard key={travel.id} travel={travel} priority={i < 3} />
            ))}
          </div>
          {res.total_pages > 1 && (
            <div className="mt-10">
              <Pagination
                page={page}
                totalPages={res.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

    </div>
  );
}
