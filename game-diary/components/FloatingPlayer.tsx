"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  ChevronDown,
  Music2,
  RefreshCw,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { useMusicPlayer } from "@/components/MusicPlayerProvider";

/**
 * 右下角悬浮播放器：内嵌 B 站外链播放器（iframe）。
 * 播放/暂停/进度等控制均在 iframe 内部完成；此处仅提供
 * 切歌、最小化与关闭。
 */
export function FloatingPlayer() {
  const player = useMusicPlayer();
  const song = player.currentSong;
  // 记录已触发 onLoad 的地址：playerUrl 变化时自动回到未就绪态，无需 effect 重置
  const [readyUrl, setReadyUrl] = useState<string | null>(null);
  const iframeReady = player.playerUrl != null && readyUrl === player.playerUrl;

  if (!song) return null;

  // 最小化：缩为封面圆钮，点击恢复
  if (player.minimized) {
    return (
      <button
        type="button"
        onClick={player.toggleMinimized}
        aria-label="展开播放器"
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-surface shadow-glow transition-transform duration-200 ease-out hover:scale-105"
      >
        {song.cover_url ? (
          <Image
            src={song.cover_url}
            alt={song.title}
            fill
            sizes="48px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <Music2 className="h-5 w-5 text-accent" strokeWidth={1.6} />
        )}
      </button>
    );
  }

  return (
    <aside
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-[340px] overflow-hidden rounded-lg border border-border bg-surface shadow-glow"
      role="group"
      aria-label="音乐播放器"
    >
      {/* Header：歌曲信息 + 最小化/关闭 */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-surface-elevated">
          {song.cover_url ? (
            <Image
              src={song.cover_url}
              alt={song.title}
              fill
              sizes="36px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Music2 className="h-4 w-4 text-text-subtle" strokeWidth={1.6} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-sm font-bold leading-tight text-text-primary">
            {song.title}
          </p>
          <p className="truncate text-xs leading-tight text-text-muted">
            {song.artist}
          </p>
        </div>
        <button
          type="button"
          onClick={player.toggleMinimized}
          aria-label="最小化播放器"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-200 hover:bg-surface-elevated hover:text-text-primary"
        >
          <ChevronDown className="h-4 w-4" strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={player.close}
          aria-label="关闭播放器"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-200 hover:bg-surface-elevated hover:text-text-primary"
        >
          <X className="h-4 w-4" strokeWidth={1.6} />
        </button>
      </div>

      {/* B 站外链播放器（16:9 iframe） */}
      <div className="relative aspect-video w-full border-y border-border bg-black">
        {player.urlLoading && (
          <div className="absolute inset-0 animate-pulse bg-surface-elevated" />
        )}
        {player.urlError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-elevated px-4 text-center">
            <AlertCircle className="h-6 w-6 text-text-subtle" strokeWidth={1.6} />
            <p className="text-xs text-text-muted">播放地址获取失败</p>
            <button
              type="button"
              onClick={player.retry}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.6} />
              重试
            </button>
          </div>
        ) : player.playerUrl ? (
          <>
            {!iframeReady && (
              <div className="absolute inset-0 animate-pulse bg-surface-elevated" />
            )}
            <iframe
              src={player.playerUrl}
              title={`${song.title} - ${song.artist}`}
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
              onLoad={() => setReadyUrl(player.playerUrl)}
              className="absolute inset-0 h-full w-full"
            />
          </>
        ) : null}
      </div>

      {/* Footer：提示 + 手动切歌（iframe 内无法感知播放结束，不做自动连播） */}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs tabular-nums text-text-subtle">
          B 站播放器内控制播放
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={player.playPrev}
            disabled={player.playlist.length === 0}
            aria-label="上一首"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:bg-surface-elevated hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SkipBack className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={player.playNext}
            disabled={player.playlist.length === 0}
            aria-label="下一首"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:bg-surface-elevated hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SkipForward className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </aside>
  );
}
