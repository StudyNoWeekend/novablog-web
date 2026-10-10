"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clapperboard } from "lucide-react";
import { videos, type Video } from "@/lib/api";
import { VideoCard } from "./video-card";
import { ErrorState } from "./error-state";

const PAGE_SIZE = 12;

interface ListResult {
  key: string;
  videos: Video[];
  totalPages: number;
  failed: boolean;
}

/** 按 URL 查询参数组合生成 /videos 链接（空值剔除） */
function buildHref(params: Record<string, string>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/videos?${qs}` : "/videos";
}

export function VideosListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const page = searchParams.get("page") ?? "1";
  const currentPage = Number(page) || 1;
  const [retryCount, setRetryCount] = useState(0);

  // 以查询参数组合为 key：结果不匹配当前 key 时自动呈现加载态（避免在 effect 内同步 setState）
  const resultKey = useMemo(
    () => `${keyword}|${currentPage}|${retryCount}`,
    [keyword, currentPage, retryCount]
  );

  const [result, setResult] = useState<ListResult | null>(null);
  const loading = result === null || result.key !== resultKey;

  useEffect(() => {
    let cancelled = false;
    videos
      .list({
        keyword: keyword || undefined,
        page: currentPage,
        page_size: PAGE_SIZE,
      })
      .then((data) => {
        if (cancelled) return;
        setResult({
          key: resultKey,
          videos: data.list,
          totalPages: data.total_pages,
          failed: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ key: resultKey, videos: [], totalPages: 0, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [resultKey, keyword, currentPage]);

  const items = result?.key === resultKey ? result.videos : [];
  const totalPages = result?.key === resultKey ? result.totalPages : 0;
  const failed = result?.key === resultKey && result.failed;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8 lg:pb-32">
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-video w-full bg-muted" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 rounded-md bg-muted" />
                <div className="h-4 w-full rounded-md bg-muted" />
                <div className="h-4 w-2/3 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : failed ? (
        <ErrorState message="视频加载失败" onRetry={() => setRetryCount((prev) => prev + 1)} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
          <Clapperboard className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">
            {keyword
              ? `没有找到与「${keyword}」相关的视频`
              : "视频作品整理中，敬请期待"}
          </p>
          {keyword && (
            <Link
              href="/videos"
              className="cursor-pointer rounded-full border border-border px-5 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              查看全部视频
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* 分页（链接驱动，静态托管可用） */}
          {totalPages > 1 && (
            <nav
              aria-label="分页"
              className="mt-12 flex items-center justify-center gap-2"
            >
              {currentPage > 1 ? (
                <Link
                  href={buildHref({ keyword, page: String(currentPage - 1) })}
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
                  href={buildHref({ keyword, page: String(currentPage + 1) })}
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
