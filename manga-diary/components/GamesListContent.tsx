"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GameCard } from "@/components/GameCard";
import { ErrorState, ListEmptyState } from "@/components/ErrorState";
import { getGames } from "@/lib/api/games";
import type { Game } from "@/lib/types";

/** 游玩状态筛选项（value 为空表示全部） */
const PLAY_STATUS_OPTIONS = [
  { value: "", label: "全部" },
  { value: "want", label: "想玩" },
  { value: "playing", label: "在玩" },
  { value: "played", label: "玩过" },
];

export function GamesListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const playStatus = searchParams.get("play_status") ?? "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [loading, setLoading] = useState(true);
  // 错误重试：递增该值重新触发取数
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState({
    list: [] as Game[],
    total_pages: 0,
    failed: false,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGames({
      keyword: keyword || undefined,
      play_status: (playStatus || undefined) as "want" | "playing" | "played" | undefined,
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
  }, [keyword, playStatus, currentPage, refreshKey]);

  return (
    <>
      {/* 游玩状态筛选 */}
      <section className="sticky top-18 z-30 border-b border-border bg-background/95 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {PLAY_STATUS_OPTIONS.map((option) => {
              const isActive = playStatus === option.value;
              return (
                <Link
                  key={option.value || "all"}
                  href={buildHref({ keyword, play_status: option.value, page: "" })}
                  className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-ink text-accent"
                      : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent-hover"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 游戏列表 */}
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            /* Skeleton 骨架屏 */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-radius-md border border-border bg-background-soft"
                >
                  <div className="aspect-[16/9] bg-border-strong/40" />
                  <div className="space-y-2 p-5">
                    <div className="h-4 w-28 rounded bg-text-muted/20" />
                    <div className="h-3 w-20 rounded bg-text-muted/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : data.failed ? (
            /* 错误重试态 */
            <ErrorState
              title="游戏库加载失败"
              onRetry={() => setRefreshKey((k) => k + 1)}
            />
          ) : data.list.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.list.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>

              {/* 分页 */}
              {data.total_pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={buildHref({ keyword, play_status: playStatus, page: String(currentPage - 1) })}
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
                      href={buildHref({ keyword, play_status: playStatus, page: String(currentPage + 1) })}
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
              message={keyword ? `未找到与「${keyword}」相关的游戏` : "游戏架还空着，敬请期待"}
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
  return qs ? `/games?${qs}` : "/games";
}
