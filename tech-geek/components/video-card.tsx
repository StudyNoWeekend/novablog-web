import Link from "next/link";
import Image from "next/image";
import { Clapperboard, ExternalLink } from "lucide-react";
import { Video } from "@/lib/api";

/** 视频卡片：封面 + 标题 + 简介 + 平台链接数 */
export function VideoCard({ video }: { video: Video }) {
  const platforms = video.platforms ?? [];

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-ring">
      <Link
        href={`/videos/${video.id}`}
        className="relative block aspect-video overflow-hidden bg-muted"
        aria-label={video.title}
      >
        {video.cover_url ? (
          <Image
            src={video.cover_url}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900">
            <Clapperboard className="h-8 w-8 text-white/70" aria-hidden="true" />
          </div>
        )}
        {platforms.length > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            {platforms.length} 个平台
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold tracking-tight text-foreground">
          <Link
            href={`/videos/${video.id}`}
            className="rounded transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {video.title}
          </Link>
        </h3>
        {video.description && (
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {video.description}
          </p>
        )}
      </div>
    </article>
  );
}
