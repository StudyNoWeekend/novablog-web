"use client";

import Image from "next/image";
import { Music2, Pause, Play } from "lucide-react";
import { useMusicPlayer } from "@/components/MusicPlayerProvider";
import type { Song } from "@/lib/types";

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * 首页音乐卡片：结构与文章卡片一致（封面 + 元信息 + 标题），
 * 点击通过全局播放器播放，播放中封面常驻暂停/播放按钮。
 */
export function SongCard({ song, onPlay }: SongCardProps) {
  const player = useMusicPlayer();
  const isActive = player.currentSong?.id === song.id;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`播放 ${song.title}`}
      aria-current={isActive}
      onClick={() => onPlay(song)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPlay(song);
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {song.cover_url ? (
          <Image
            src={song.cover_url}
            alt={song.title}
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
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/80 via-background/20 to-transparent transition-opacity duration-300 ease-out ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-accent text-background shadow-lg transition-transform duration-300 ease-out ${
              isActive ? "scale-100" : "scale-90 group-hover:scale-100"
            }`}
          >
            {player.urlLoading && isActive ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : player.isPlaying && isActive ? (
              <Pause className="h-5 w-5 fill-current" strokeWidth={1.5} />
            ) : (
              <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={1.5} />
            )}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-text-muted">
          <span className="truncate">{song.artist}</span>
          <span className="text-text-subtle">·</span>
          <span className="shrink-0 tabular-nums">
            {formatDuration(song.duration)}
          </span>
        </div>
        <h3
          className={`line-clamp-2 font-[var(--font-playfair)] text-lg font-semibold leading-snug transition-colors duration-200 ease-out group-hover:text-accent ${
            isActive ? "text-accent" : "text-text-primary"
          }`}
        >
          {song.title}
        </h3>
      </div>
    </div>
  );
}
