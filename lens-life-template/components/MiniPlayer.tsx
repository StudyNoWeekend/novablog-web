"use client";

import Image from "next/image";
import { Music2, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { useMusicPlayer } from "@/components/MusicPlayerProvider";

/**
 * 导航栏内嵌迷你播放器：无播放时渲染 null。
 */
export function MiniPlayer() {
  const player = useMusicPlayer();
  const song = player.currentSong;

  if (!song) return null;

  const duration = player.duration || song.duration || 0;
  const progress =
    duration > 0 ? Math.min((player.currentTime / duration) * 100, 100) : 0;

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    player.seek(ratio);
  };

  return (
    <div
      className="relative flex items-center gap-1.5 rounded-full border border-border bg-surface/80 py-1 pl-1 pr-1.5"
      role="group"
      aria-label="迷你播放器"
    >
      {/* Cover */}
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-background-soft">
        {song.cover_url ? (
          <Image
            src={song.cover_url}
            alt={song.title}
            fill
            sizes="32px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 className="h-3.5 w-3.5 text-text-subtle" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Title / Artist */}
      <div className="hidden min-w-0 max-w-[150px] sm:block">
        <p className="truncate text-xs font-medium leading-tight text-text-primary">
          {song.title}
        </p>
        <p className="truncate text-[10px] leading-tight text-text-muted">
          {song.artist}
        </p>
      </div>

      {/* Controls */}
      <button
        type="button"
        onClick={player.playPrev}
        aria-label="上一首"
        className="hidden h-7 w-7 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:text-accent md:flex"
      >
        <SkipBack className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={player.togglePlay}
        disabled={player.urlLoading || player.urlError}
        aria-label={player.isPlaying ? "暂停" : "播放"}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-accent text-background transition-all duration-200 ease-out hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {player.urlLoading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-background border-t-transparent" />
        ) : player.isPlaying ? (
          <Pause className="h-3.5 w-3.5 fill-current" strokeWidth={1.5} />
        ) : (
          <Play className="ml-px h-3.5 w-3.5 fill-current" strokeWidth={1.5} />
        )}
      </button>
      <button
        type="button"
        onClick={player.playNext}
        aria-label="下一首"
        className="hidden h-7 w-7 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:text-accent md:flex"
      >
        <SkipForward className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={player.close}
        aria-label="关闭播放器"
        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-200 hover:text-text-primary"
      >
        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>

      {/* Thin seekable progress line */}
      <div
        onClick={handleSeek}
        role="slider"
        aria-label="播放进度"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(player.currentTime)}
        tabIndex={0}
        className="absolute inset-x-3 bottom-0 h-2 cursor-pointer py-[3px]"
      >
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
