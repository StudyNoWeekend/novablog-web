"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VideoCard } from "@/components/VideoCard";
import { getVideos } from "@/lib/api/videos";
import type { Video } from "@/lib/types";

interface SearchParams {
  keyword?: string;
  page?: string;
}

/** 作品展示列表（客户端取数）：视频作品网格 + 分页 */
export function VideosListContent() {
  const searchParams = useSearchParams();
  const params: SearchParams = {
    keyword: searchParams.get("keyword") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  };

  const currentPage = params.page ? Number(params.page) : 1;

  const [loading, setLoading] = useState(true);
  const [videosData, setVideosData] = useState({
    list: [] as Video[],
    total_pages: 0,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getVideos({
      keyword: params.keyword,
      page: currentPage,
      page_size: 12,
    }).then((data) => {
      if (cancelled) return;
      setVideosData({ list: data.list, total_pages: data.total_pages });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.keyword, params.page]);

  const videos = videosData.list;

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[16/11] animate-pulse rounded-xl bg-surface"
              />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Pagination */}
            {videosData.total_pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildHref({ ...params, page: String(currentPage - 1) })}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                  >
                    上一页
                  </Link>
                )}
                <span className="px-4 font-hand text-lg text-text-muted">
                  {currentPage} / {videosData.total_pages}
                </span>
                {currentPage < videosData.total_pages && (
                  <Link
                    href={buildHref({ ...params, page: String(currentPage + 1) })}
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
            <p className="font-hand text-3xl text-text-subtle">rolling soon…</p>
            <p className="mt-2 text-lg text-text-muted">
              {params.keyword
                ? `未找到与「${params.keyword}」相关的视频作品`
                : "暂无视频作品，敬请期待"}
            </p>
            <Link
              href="/works"
              className="mt-4 cursor-pointer text-sm font-medium text-accent-hover transition-colors duration-200 ease-out hover:text-accent"
            >
              查看全部作品
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
  return qs ? `/works?${qs}` : "/works";
}
