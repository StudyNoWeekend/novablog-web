import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
}

/** 视频作品卡片：封面 + 标题 + 描述 + 平台外链 chips（无详情页） */
export function VideoCard({ video }: VideoCardProps) {
  const platforms = video.platforms ?? [];

  return (
    <article className="flex flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover">
      <div className="relative aspect-video overflow-hidden bg-background-soft">
        {video.cover_url ? (
          <Image
            src={video.cover_url}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-subtle">
            <span className="font-heading text-sm">暂无封面</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-heading text-base leading-snug text-text-primary">
          {video.title}
        </h2>
        {video.description && (
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-text-muted">
            {video.description}
          </p>
        )}

        {platforms.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            {platforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background-soft px-3.5 text-xs text-text-muted transition-colors duration-200 ease-out hover:border-accent hover:text-accent"
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
