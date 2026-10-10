"use client";

import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import { getFileUrl } from "@/lib/api/client";
import type { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
}

/** 视频作品卡片：封面 + 标题 + 描述 + 平台外链 chip（无详情页） */
export function VideoCard({ video }: VideoCardProps) {
  const platforms = video.platforms ?? [];

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover">
      {/* 封面 */}
      <div className="relative aspect-video overflow-hidden bg-surface-elevated">
        {video.cover_url ? (
          <Image
            src={getFileUrl(video.cover_url)}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(100%_120%_at_50%_0%,#1d2f26_0%,#16211c_70%)]">
            <Play className="h-9 w-9 text-accent/40" strokeWidth={1.2} />
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[17px] font-bold leading-snug text-text-primary">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
            {video.description}
          </p>
        )}

        {platforms.length > 0 && (
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            {platforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background-soft px-3.5 text-xs text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                {platform.platform || "观看视频"}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
