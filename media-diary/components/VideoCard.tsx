"use client";

import Image from "next/image";
import { ExternalLink, MonitorPlay } from "lucide-react";
import type { Video } from "@/lib/types";

/**
 * 视频卡片：封面 + 播放浮层 + 标题/描述 + 平台角标。
 * 视频源托管在第三方平台，点击封面新窗口打开原始页面。
 */
export function VideoCard({ video }: { video: Video }) {
  const primary = video.platforms?.[0];
  const href = primary?.url || null;
  const dateStr = video.created_at
    ? new Date(video.created_at).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover">
      <a
        href={href ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`打开视频《${video.title}》`}
        className="relative block aspect-[16/10] w-full cursor-pointer overflow-hidden bg-background-soft"
      >
        {video.cover_url ? (
          <Image
            src={video.cover_url}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-subtle">
            <MonitorPlay className="h-10 w-10" strokeWidth={1.2} />
          </div>
        )}
        {/* 悬浮外链角标 */}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/15">
          <span className="flex h-11 w-11 scale-90 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
            <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
          </span>
        </span>
        {primary?.platform && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-ink/70 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            {primary.platform}
          </span>
        )}
      </a>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-base leading-snug text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-muted">
            {video.description}
          </p>
        )}
        {dateStr && (
          <p className="mt-auto pt-3 text-xs text-text-subtle">{dateStr}</p>
        )}
      </div>
    </article>
  );
}
