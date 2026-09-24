"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Music2,
  Pause,
  Play,
  RefreshCw,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { useMusicPlayer, type PlayMode } from "@/components/MusicPlayerProvider";

const PLAY_MODE_META: Record<
  PlayMode,
  { label: string; short: string; icon: typeof Repeat }
> = {
  sequential: { label: "顺序播放", short: "顺序", icon: Repeat },
  random: { label: "随机播放", short: "随机", icon: Shuffle },
  single: { label: "单曲循环", short: "单曲", icon: Repeat1 },
};

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * 页面底部音乐播放器（点击歌曲后滑出）。
 * B 站外链 iframe 仅作为隐藏的音频引擎（1px 透明，不展示视频画面），
 * 播放/暂停以 autoplay=0/1 + t 定位重载实现，进度条随之一致；
 * 播放模式以图标 + 文字展示，点击循环切换。
 */
export function FloatingPlayer() {
  const player = useMusicPlayer();
  const song = player.currentSong;
  // 拖拽中的临时进度；松手才真正 seek，避免拖动过程频繁重载 iframe
  const [dragValue, setDragValue] = useState<number | null>(null);

  if (!song) return null;

  const duration = song.duration > 0 ? Math.floor(song.duration) : 0;
  const canSeek = duration > 0;
  const displayPos = dragValue ?? player.position;
  const modeMeta = PLAY_MODE_META[player.playMode];
  const ModeIcon = modeMeta.icon;

  const commitSeek = () => {
    if (dragValue == null) return;
    player.seekTo(dragValue);
    setDragValue(null);
  };

  return (
    <>
      {/* 隐藏的音频引擎：B 站外链 iframe 继续供声，界面不展示视频。
          保留 1px 尺寸与透明度而非 display:none，避免部分浏览器挂起其媒体播放 */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 -z-10 h-px w-px overflow-hidden opacity-0"
      >
        {player.playerUrl ? (
          <iframe
            key={player.playSeq}
            src={player.playerUrl}
            title={`${song.title} - ${song.artist}`}
            allow="autoplay; fullscreen; encrypted-media"
            scrolling="no"
            frameBorder="0"
            className="h-full w-full"
          />
        ) : null}
      </div>

      {/* 底部播放器条（随歌曲出现，播放期间保持挂载；入场动画见 globals.css 的 player-slide-up） */}
      <aside
        role="group"
        aria-label="音乐播放器"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface shadow-lg animate-[player-slide-up_0.3s_ease-out] motion-reduce:animate-none"
      >
        <div className="mx-auto flex h-24 w-full max-w-3xl flex-col justify-center gap-1 px-4">
          {/* 进度行：估算进度，拖拽松手后通过 t 参数重载 iframe 跳转 */}
          {player.urlError ? (
            <div className="flex h-5 items-center justify-center gap-2 text-xs text-text-muted">
              <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
              播放地址获取失败
              <button
                type="button"
                onClick={player.retry}
                className={`flex cursor-pointer items-center gap-1 rounded-radius-sm border border-border px-2 py-0.5 text-xs text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent ${focusRing}`}
              >
                <RefreshCw className="h-3 w-3" strokeWidth={1.5} />
                重试
              </button>
            </div>
          ) : canSeek ? (
            <div className="flex h-5 items-center gap-3">
              <span className="w-10 shrink-0 text-right text-xs tabular-nums text-text-subtle">
                {formatTime(displayPos)}
              </span>
              <input
                type="range"
                min={0}
                max={duration}
                step={1}
                value={Math.round(Math.min(Math.max(displayPos, 0), duration))}
                onChange={(e) => setDragValue(Number(e.target.value))}
                onPointerUp={commitSeek}
                onKeyUp={commitSeek}
                aria-label="播放进度"
                aria-valuetext={`${formatTime(displayPos)} / ${formatTime(duration)}`}
                className="min-w-0 flex-1 cursor-pointer accent-accent"
              />
              <span className="w-10 shrink-0 text-xs tabular-nums text-text-subtle">
                {formatTime(duration)}
              </span>
            </div>
          ) : (
            <p className="h-5 text-center text-xs leading-5 text-text-subtle">
              暂无时长信息
            </p>
          )}

          {/* 信息 + 控制 */}
          <div className="flex h-14 items-center gap-2 sm:gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-background-soft">
              {song.cover_url ? (
                <Image
                  src={song.cover_url}
                  alt={song.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Music2 className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight text-text-primary">
                {song.title}
              </p>
              <p className="truncate text-xs leading-tight text-text-muted">
                {song.artist}
              </p>
            </div>

            {/* 播放模式：图标 + 文字展示当前模式，点击循环切换 */}
            <button
              type="button"
              onClick={player.cyclePlayMode}
              aria-label={`播放模式：${modeMeta.label}`}
              title={`播放模式：${modeMeta.label}`}
              className={`flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2 text-accent transition-colors duration-200 hover:bg-accent-subtle sm:px-2.5 ${focusRing}`}
            >
              <ModeIcon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="text-xs leading-none sm:hidden">{modeMeta.short}</span>
              <span className="hidden text-xs leading-none sm:inline">
                {modeMeta.label}
              </span>
            </button>

            <button
              type="button"
              onClick={player.playPrev}
              disabled={player.playlist.length === 0}
              aria-label="上一首"
              className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:bg-background-soft hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
            >
              <SkipBack className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={player.togglePlay}
              aria-label={player.isPaused ? "播放" : "暂停"}
              className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-background shadow-lg transition-transform duration-200 hover:scale-105 ${focusRing}`}
            >
              {player.isPaused ? (
                <Play className="h-5 w-5 translate-x-px fill-current" strokeWidth={1.5} />
              ) : (
                <Pause className="h-5 w-5 fill-current" strokeWidth={1.5} />
              )}
            </button>
            <button
              type="button"
              onClick={player.playNext}
              disabled={player.playlist.length === 0}
              aria-label="下一首"
              className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:bg-background-soft hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
            >
              <SkipForward className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={player.stop}
              aria-label="关闭播放"
              className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-200 hover:bg-background-soft hover:text-text-primary ${focusRing}`}
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>

      {/* 播放器激活时为页面流补等高占位，避免遮挡 Footer */}
      <div className="h-24 shrink-0" aria-hidden="true" />
    </>
  );
}
