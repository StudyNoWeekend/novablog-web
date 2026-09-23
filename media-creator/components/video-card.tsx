"use client";

import Image from "next/image";
import { Clapperboard, ExternalLink, Play } from "lucide-react";
import type { Video } from "@/lib/api";

interface VideoCardProps {
  video: Video;
  priority?: boolean;
}

/** 视频卡片：封面悬停浮现播放按钮，底部标题 + 平台胶囊链接 */
export function VideoCard({ video, priority }: VideoCardProps) {
  return (
    <div className="group card-lift cursor-pointer overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-video overflow-hidden">
        {video.cover_url ? (
          <Image
            src={video.cover_url}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            unoptimized
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Clapperboard className="h-10 w-10 text-muted-foreground/60" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
          <span className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {video.title}
        </h3>
        {video.platforms && video.platforms.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {video.platforms.slice(0, 3).map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {platform.platform}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
