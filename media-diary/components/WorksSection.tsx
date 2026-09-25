"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { getVideos } from "@/lib/api/videos";
import type { Video } from "@/lib/types";

/**
 * 首页「近期作品」区块（对应 UI 图视频卡片行）：
 * 最新 4 条视频作品，封面 + 标题 + 描述 + 平台角标
 */
export function WorksSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getVideos({ page: 1, page_size: 4 }).then((data) => {
      if (cancelled) return;
      setVideos(data.list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-background pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-6 w-6 fill-accent text-accent" strokeWidth={0} />
          <h2 className="font-display text-2xl text-text-primary md:text-3xl">
            近期作品
          </h2>
        </div>
        <div className="mb-10 flex items-end justify-between gap-4">
          <p className="text-sm text-text-muted md:text-base">
            精选我最满意的创作，持续更新中…
          </p>
          <Link
            href="/works"
            className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-accent-hover"
          >
            查看更多
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[16/10] animate-pulse rounded-xl bg-background-soft"
              />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border-strong bg-surface py-12 text-center text-sm text-text-muted">
            视频作品正在路上，敬请期待…
          </div>
        )}
      </div>
    </section>
  );
}
