import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import type { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  // Whole card jumps to the first platform link (no JS needed)
  const targetUrl = video.platforms?.[0]?.url ?? "";

  return (
    <a
      href={targetUrl || undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`观看视频：${video.title}`}
      className={`group flex flex-col overflow-hidden rounded-radius-md bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover ${
        targetUrl ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        {video.cover_url ? (
          <Image
            src={video.cover_url}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-background-soft text-text-subtle">
            <span className="text-sm">暂无封面</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-accent backdrop-blur-sm transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-accent group-hover:text-background group-hover:shadow-[0_0_24px_rgba(212,163,115,0.5)]">
            <Play className="ml-0.5 h-6 w-6 fill-current" strokeWidth={1.5} />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 font-[var(--font-playfair)] text-lg font-semibold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent">
          {video.title}
        </h3>
        {video.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
            {video.description}
          </p>
        )}
        {video.platforms && video.platforms.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            {video.platforms.slice(0, 3).map((platform) => (
              <span
                key={platform.id}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-background-soft px-2.5 py-1 text-xs text-text-muted"
              >
                <ExternalLink className="h-3 w-3 text-text-subtle" strokeWidth={1.5} />
                {platform.platform}
              </span>
            ))}
            <span className="ml-auto text-xs text-text-subtle transition-colors duration-200 group-hover:text-accent">
              前往观看 →
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
