"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { PlaySquare, ExternalLink, Search, Loader2 } from "lucide-react";
import { videos, type PaginatedResponse, type Video } from "@/lib/api";
import { Pagination } from "@/components/pagination";

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
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">视频作品</h1>
            <p className="mt-2 text-muted-foreground">点击平台链接即可跳转观看</p>
          </div>

          <form action="/videos" method="GET" className="flex w-full max-w-sm items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="keyword"
                defaultValue={keyword}
                placeholder="搜索视频标题..."
                aria-label="搜索视频标题"
                className="w-full rounded-full border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full gradient-creator px-5 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
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
          <div className="mt-10 rounded-2xl bg-card p-12 text-center text-destructive border border-border">
            {error}
          </div>
        ) : res?.list.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-card p-12 text-center text-muted-foreground border border-border">
            <PlaySquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">暂无视频作品</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {res?.list.map((video) => (
              <div
                key={video.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm border border-border transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden">
                  {video.cover_url ? (
                    <Image
                      src={video.cover_url}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <PlaySquare className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                    <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100">
                      <PlaySquare className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-base font-semibold text-foreground">{video.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {video.platforms?.map((platform) => (
                      <a
                        key={platform.id}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {platform.platform}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
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
