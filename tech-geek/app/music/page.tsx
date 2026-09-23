"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Music, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { music, getModuleConfig, Song } from "@/lib/api";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [iframeReady, setIframeReady] = useState(false);
  // 防止快速切歌时旧请求的响应覆盖新歌曲的播放地址
  const requestedRef = useRef<string | null>(null);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        music.list({ page: 1, page_size: 100 }),
        getModuleConfig(),
      ]);
      setSongs(res.list);
      setMusicEnabled(modules.music_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载歌曲失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handlePlay = async (song: Song) => {
    if (currentSong?.id === song.id) return;
    requestedRef.current = song.id;
    setCurrentSong(song);
    setPlayerUrl(null);
    setIframeReady(false);
    setUrlError(null);
    setUrlLoading(true);

    try {
      // 返回 B 站官方外链播放器地址，必须用 iframe 内嵌播放
      const res = await music.playerUrl(song.id);
      if (requestedRef.current !== song.id) return;
      setPlayerUrl(res.url);
    } catch (err) {
      if (requestedRef.current !== song.id) return;
      setUrlError(err instanceof Error ? err.message : "获取播放地址失败");
    } finally {
      if (requestedRef.current === song.id) {
        setUrlLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Loading text="加载歌曲中..." />
      </div>
    );
  }

  if (!musicEnabled) {
    return <ModuleDisabled moduleLabel="音乐" />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState title="歌曲加载失败" message={error} onRetry={fetchSongs} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Music className="h-7 w-7 text-primary" aria-hidden="true" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          音乐播放器
        </h1>
      </div>

      {/* Player：B 站官方外链播放器（iframe 内嵌，播放控制在 iframe 内完成） */}
      {currentSong && (
        <div className="mb-8 rounded-lg border border-border bg-card p-4 md:p-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border bg-black">
            {urlLoading && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            {urlError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted px-4 text-center">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{urlError}</p>
                <button
                  type="button"
                  onClick={() => handlePlay(currentSong)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  重试
                </button>
              </div>
            ) : playerUrl ? (
              <>
                {!iframeReady && (
                  <div className="absolute inset-0 animate-pulse bg-muted" />
                )}
                <iframe
                  src={playerUrl}
                  title={`${currentSong.title} - ${currentSong.artist}`}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                  scrolling="no"
                  frameBorder="0"
                  onLoad={() => setIframeReady(true)}
                  className="absolute inset-0 h-full w-full"
                />
              </>
            ) : null}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">
                {currentSong.title}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {currentSong.artist}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(currentSong.duration)}
            </span>
          </div>
        </div>
      )}

      {/* Song list */}
      {songs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          暂无歌曲
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <ul className="divide-y divide-border">
            {songs.map((song, index) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <li
                  key={song.id}
                  onClick={() => handlePlay(song)}
                  className={`flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-muted ${
                    isCurrent ? "bg-primary/5" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handlePlay(song);
                    }
                  }}
                  aria-label={`播放 ${song.title}`}
                >
                  <span className="w-6 text-center font-mono text-sm text-muted-foreground">
                    {isCurrent ? (
                      // iframe 内无法感知播放状态，静态音柱仅表示"当前歌曲"
                      <span
                        className="inline-flex h-4 items-end gap-0.5"
                        aria-label="当前歌曲"
                      >
                        <span className="w-0.5 rounded bg-primary" style={{ height: "60%" }} />
                        <span className="w-0.5 rounded bg-primary" style={{ height: "100%" }} />
                        <span className="w-0.5 rounded bg-primary" style={{ height: "80%" }} />
                      </span>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-muted">
                    {song.cover_url ? (
                      <Image
                        src={song.cover_url}
                        alt={song.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Music className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-medium ${isCurrent ? "text-primary" : "text-foreground"}`}>
                      {song.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
                  </div>
                  <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(song.duration)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
