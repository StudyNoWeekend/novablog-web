import Image from "next/image";
import { ExternalLink, Music2 } from "lucide-react";
import type { Playlist } from "@/lib/types";

export const PLATFORM_LABELS: Record<string, string> = {
  qq_music: "QQ 音乐",
  netease: "网易云音乐",
  netease_music: "网易云音乐",
  spotify: "Spotify",
  apple_music: "Apple Music",
  migu: "咪咕音乐",
  kugou: "酷狗音乐",
  kuwo: "酷我音乐",
};

export function PlatformBadge({ platform }: { platform: string }) {
  const label = PLATFORM_LABELS[platform] || platform;
  return (
    <span className="inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent">
      {label}
    </span>
  );
}

interface PlaylistCardProps {
  playlist: Playlist;
}

/**
 * 首页歌单卡片：结构与文章卡片一致（封面 + 标题 + 摘要），
 * 第三方歌单无站内音源，点击跳转对应平台播放。
 */
export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <a
      href={playlist.platform_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {playlist.cover_url ? (
          <Image
            src={playlist.cover_url}
            alt={playlist.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-background-soft text-text-subtle">
            <Music2 className="h-8 w-8" strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
          <ExternalLink className="h-3.5 w-3.5 text-white" strokeWidth={2} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <PlatformBadge platform={playlist.platform} />
        </div>
        <h3 className="mb-2 line-clamp-2 font-[var(--font-playfair)] text-lg font-semibold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent">
          {playlist.title}
        </h3>
        {playlist.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
            {playlist.description}
          </p>
        )}
      </div>
    </a>
  );
}
