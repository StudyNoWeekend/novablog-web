"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VideoCard } from "@/components/VideoCard";
import { getVideos } from "@/lib/api/videos";
import type { Video } from "@/lib/types";

export function VideosListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? undefined;
  const currentPage = Number(searchParams.get("page") ?? "1") || 1;

  const [loading, setLoading] = useState(true);
  const [videosData, setVideosData] = useState({
    list: [] as Video[],
    total: 0,
    total_pages: 0,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getVideos({
      keyword,
      page: currentPage,
      page_size: 12,
    }).then((data) => {
      if (cancelled) return;
      setVideosData({
        list: data.list,
        total: data.total,
        total_pages: data.total_pages,
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [keyword, currentPage]);

  const videos = videosData.list;

  const buildHref = (page: number) => {
    const query = new URLSearchParams();
    if (keyword) query.set("keyword", keyword);
    if (page > 1) query.set("page", String(page));
    const qs = query.toString();
    return qs ? `/videos?${qs}` : "/videos";
  };

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[16/12] animate-pulse rounded-radius-md bg-surface"
              />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <>
            <p className="mb-5 text-sm text-text-subtle">
              共 {videosData.total} 个视频
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Pagination */}
            {videosData.total_pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildHref(currentPage - 1)}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                  >
                    上一页
                  </Link>
                )}
                <span className="px-4 text-sm text-text-muted">
                  {currentPage} / {videosData.total_pages}
                </span>
                {currentPage < videosData.total_pages && (
                  <Link
                    href={buildHref(currentPage + 1)}
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
            <p className="text-lg text-text-muted">
              {keyword
                ? `未找到与「${keyword}」相关的视频`
                : "暂无视频，敬请期待"}
            </p>
            <Link
              href="/videos"
              className="mt-4 cursor-pointer text-sm font-semibold text-accent-hover transition-colors duration-200 ease-out hover:text-accent-2"
            >
              查看全部视频
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
