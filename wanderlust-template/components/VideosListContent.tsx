"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clapperboard } from "lucide-react";
import { getVideos } from "@/lib/api/videos";
import type { Video } from "@/lib/types";
import { VideoCard } from "@/components/VideoCard";
import { ErrorState } from "@/components/ErrorState";

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

  const [result, setResult] = useState<{
    key: string;
    videos: Video[];
    totalPages: number;
    failed: boolean;
  } | null>(null);
  const loading = result === null || result.key !== resultKey;

  useEffect(() => {
    let cancelled = false;
    getVideos({
      keyword: keyword || undefined,
      page: currentPage,
      page_size: 12,
    }).then((data) => {
      if (cancelled) return;
      setResult({
        key: resultKey,
        videos: data.list,
        totalPages: data.total_pages,
        failed: Boolean(data.failed),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [resultKey, keyword, currentPage]);

  const videos = result?.key === resultKey ? result.videos : [];
  const totalPages = result?.key === resultKey ? result.totalPages : 0;
  const failed = result?.key === resultKey ? result.failed : false;

  const buildHref = (nextPage: number) => {
    const query = new URLSearchParams();
    if (keyword) query.set("keyword", keyword);
    if (nextPage > 1) query.set("page", String(nextPage));
    const qs = query.toString();
    return qs ? `/videos?${qs}` : "/videos";
  };

  if (failed) {
    return <ErrorState onRetry={() => setRetryCount((prev) => prev + 1)} />;
  }

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video animate-pulse rounded-radius-lg bg-surface"
              />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildHref(currentPage - 1)}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    上一页
                  </Link>
                )}
                <span className="px-4 text-sm text-text-muted">
                  {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={buildHref(currentPage + 1)}
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle">
              <Clapperboard className="h-7 w-7 text-accent" strokeWidth={1.5} />
            </div>
            <p className="mt-6 font-display text-xl text-text-secondary">
              {keyword
                ? `未找到与「${keyword}」相关的视频`
                : "视频作品整理中，敬请期待"}
            </p>
            <Link
              href="/videos"
              className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              查看全部视频
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
