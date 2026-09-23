import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import type { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  // 整卡跳转第一个平台链接（无 JS 依赖）
  const targetUrl = video.platforms?.[0]?.url ?? "";
  const dateStr = video.created_at;
  const formattedDate = new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <a
      href={targetUrl || undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`观看视频：${video.title}`}
      className={`group flex flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover ${
        targetUrl ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        {video.cover_url ? (
          <Image
            src={video.cover_url}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-elevated to-background-soft text-text-subtle">
            <span className="text-sm">暂无封面</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-accent-hover backdrop-blur-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-accent group-hover:text-white group-hover:shadow-glow">
            <Play className="ml-0.5 h-6 w-6 fill-current" strokeWidth={1.5} />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 font-heading text-lg font-bold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
          {video.title}
        </h3>
        {video.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
            {video.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-text-subtle">
          {video.platforms && video.platforms.length > 0 ? (
            <>
              {video.platforms.slice(0, 2).map((platform) => (
                <span
                  key={platform.id}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background-soft px-2.5 py-1 text-text-muted"
                >
                  <ExternalLink className="h-3 w-3 text-text-subtle" strokeWidth={1.5} />
                  {platform.platform}
                </span>
              ))}
              <span className="ml-auto transition-colors duration-200 group-hover:text-accent-hover">
                前往观看 →
              </span>
            </>
          ) : (
            <span className="ml-auto">{formattedDate}</span>
          )}
        </div>
      </div>
    </a>
  );
}
