"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clapperboard, Loader2, Search } from "lucide-react";
import { videos, type PaginatedResponse, type Video } from "@/lib/api";
import { Pagination } from "@/components/pagination";
import { VideoCard } from "@/components/video-card";

export function VideosContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 12;

  const [res, setRes] = useState<PaginatedResponse<Video> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    videos
      .list({ page, page_size: pageSize, keyword })
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
  }, [keyword, page]);

  const handlePageChange = (p: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(p));
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-hand text-3xl text-foreground sm:text-4xl">我的作品</h1>
            <p className="mt-2 text-muted-foreground">每一支视频，都是一次热爱的记录</p>
          </div>

          <form action="/videos" method="GET" className="flex w-full max-w-sm items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="keyword"
                defaultValue={keyword}
                placeholder="搜索视频标题..."
                aria-label="搜索视频标题"
                className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              搜索
            </button>
          </form>
        </div>

        {keyword && (
          <div className="mt-4 text-sm text-muted-foreground">
            {res && res.total > 0
              ? `找到 ${res.total} 个与 "${keyword}" 相关的视频`
              : `未找到与 "${keyword}" 相关的视频`}
          </div>
        )}

        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            加载中...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center text-destructive">
            {error}
          </div>
        ) : res?.list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            <Clapperboard className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">暂无视频作品</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {res?.list.map((video, i) => (
              <VideoCard key={video.id} video={video} priority={i < 4} />
            ))}
          </div>
        )}

        {res && res.total_pages > 1 && (
          <div className="mt-10">
            <Pagination page={res.page} totalPages={res.total_pages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
