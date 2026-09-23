"use client";

import Image from "next/image";
import { ExternalLink, ListMusic, Music2 } from "lucide-react";
import type { Playlist } from "@/lib/types";

export function PlatformBadge({ platform }: { platform: string }) {
  if (!platform) return null;
  return (
    <span className="shrink-0 rounded-full border border-accent/30 bg-accent-subtle px-2 py-0.5 text-[10px] font-medium text-accent">
      {platform}
    </span>
  );
}

/** 首页侧栏「热门歌单」条目 */
export function PlaylistSidebarItem({ playlist }: { playlist: Playlist }) {
  return (
    <a
      href={playlist.platform_url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-surface-elevated"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-elevated">
        {playlist.cover_url ? (
          <Image
            src={playlist.cover_url}
            alt={playlist.title}
            fill
            sizes="48px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ListMusic className="h-5 w-5 text-text-subtle" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary transition-colors duration-200 group-hover:text-accent">
          {playlist.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-text-subtle">
          {playlist.platform ? `${playlist.platform} · ` : ""}
          {playlist.description}
        </p>
      </div>
      <ExternalLink
        className="h-3.5 w-3.5 shrink-0 text-text-subtle opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        strokeWidth={1.5}
      />
    </a>
  );
}

/** 歌单页大卡片 */
export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <a
      href={playlist.platform_url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-pointer overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-elevated">
        {playlist.cover_url ? (
          <Image
            src={playlist.cover_url}
            alt={playlist.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 className="h-10 w-10 text-text-subtle" strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-accent-strong text-on-accent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[15px] font-semibold text-text-primary transition-colors duration-200 group-hover:text-accent">
            {playlist.title}
          </h3>
          <PlatformBadge platform={playlist.platform} />
        </div>
        {playlist.description && (
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-text-muted">
            {playlist.description}
          </p>
        )}
      </div>
    </a>
  );
}
