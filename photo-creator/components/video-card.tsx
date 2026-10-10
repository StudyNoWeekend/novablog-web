import Image from "next/image";
import { Clapperboard, ExternalLink } from "lucide-react";
import type { Video } from "@/lib/api";

/** 视频作品卡片：aspect-video 封面 + 标题 + 描述 + 平台外链 chip（无详情页） */
export function VideoCard({ video }: { video: Video }) {
  const platforms = video.platforms ?? [];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40 focus-within:ring-2 focus-within:ring-ring">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {video.cover_url ? (
          <Image
            src={video.cover_url}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Clapperboard className="size-10" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-medium text-foreground">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border px-3.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="size-3.5" aria-hidden="true" />
                {platform.platform || "观看视频"}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
