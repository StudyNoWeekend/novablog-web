"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Map } from "lucide-react";
import { travels, type TravelGuide } from "@/lib/api";
import { TravelCard } from "./travel-card";
import { ErrorState } from "./error-state";
import { ArticleGridSkeleton } from "./loading";

const PAGE_SIZE = 12;

/** 天数筛选选项（后端 days_range：1-3|4-7|8-14|15+，空=全部） */
const DAYS_OPTIONS = [
  { value: "", label: "全部天数" },
  { value: "1-3", label: "1-3 天" },
  { value: "4-7", label: "4-7 天" },
  { value: "8-14", label: "8-14 天" },
  { value: "15+", label: "15 天以上" },
];

/** 排序选项（后端 sort：views|rating|likes，空=默认） */
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

/** 按 URL 查询参数组合生成 /travels 链接（空值剔除） */
function buildHref(params: Record<string, string>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/travels?${qs}` : "/travels";
}

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
    travels
      .list({
        keyword: keyword || undefined,
        days_range: daysRange || undefined,
        sort: sort || undefined,
        page: currentPage,
        page_size: PAGE_SIZE,
      })
      .then((data) => {
        if (cancelled) return;
        setResult({
          key: resultKey,
          travels: data.list,
          totalPages: data.total_pages,
          failed: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ key: resultKey, travels: [], totalPages: 0, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [resultKey, keyword, daysRange, sort, currentPage]);

  const items = result?.key === resultKey ? result.travels : [];
  const totalPages = result?.key === resultKey ? result.totalPages : 0;
  const failed = result?.key === resultKey && result.failed;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8 lg:pb-32">
      {/* 天数 / 排序筛选 chips（纯链接驱动，静态托管可用） */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {DAYS_OPTIONS.map((option) => {
            const isActive = daysRange === option.value;
            return (
              <Link
                key={option.value || "all"}
                href={buildHref({
                  keyword,
                  days_range: option.value,
                  sort,
                  page: "",
                })}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex cursor-pointer items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SORT_OPTIONS.map((option) => {
            const isActive = sort === option.value;
            return (
              <Link
                key={option.value || "default"}
                href={buildHref({
                  keyword,
                  days_range: daysRange,
                  sort: option.value,
                  page: "",
                })}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex cursor-pointer items-center rounded-full px-3 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "bg-muted font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>

      {loading ? (
        <ArticleGridSkeleton count={6} />
      ) : failed ? (
        <ErrorState message="旅行攻略加载失败" onRetry={() => setRetryCount((prev) => prev + 1)} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
          <Map className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">
            {keyword
              ? `没有找到与「${keyword}」相关的旅行攻略`
              : "暂无旅行攻略，敬请期待"}
          </p>
          {(keyword || daysRange || sort) && (
            <Link
              href="/travels"
              className="cursor-pointer rounded-full border border-border px-5 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              查看全部攻略
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((travel) => (
              <TravelCard key={travel.id} travel={travel} />
            ))}
          </div>

          {/* 分页（链接驱动，与筛选 chips 一致） */}
          {totalPages > 1 && (
            <nav
              aria-label="分页"
              className="mt-12 flex items-center justify-center gap-2"
            >
              {currentPage > 1 ? (
                <Link
                  href={buildHref({
                    keyword,
                    days_range: daysRange,
                    sort,
                    page: String(currentPage - 1),
                  })}
                  className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-card px-4 text-sm text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  上一页
                </Link>
              ) : null}
              <span className="px-4 text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={buildHref({
                    keyword,
                    days_range: daysRange,
                    sort,
                    page: String(currentPage + 1),
                  })}
                  className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-card px-4 text-sm text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  下一页
                </Link>
              ) : null}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
