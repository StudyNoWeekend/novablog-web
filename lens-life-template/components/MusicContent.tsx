"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music2 } from "lucide-react";
import { getSongs } from "@/lib/api/music";
import { useMusicPlayer } from "@/components/MusicPlayerProvider";
import type { Song } from "@/lib/types";

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MusicContent() {
  const player = useMusicPlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSongs({ page: 1, page_size: 100 }).then((data) => {
      if (cancelled) return;
      setSongs(data.list);
      player.setPlaylist(data.list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentId = player.currentSong?.id ?? null;

  return (
    <div className="flex-1 bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="font-[var(--font-heading)] text-4xl font-medium text-text-primary sm:text-5xl">
            音乐分享
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            写代码、修图、赶路时陪伴我的旋律。点击任意一首，播放器将收进顶部导航栏。
          </p>
        </header>

        {loading ? (
          <ul className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="flex animate-pulse items-center gap-4 rounded-radius-md bg-surface p-4"
              >
                <div className="h-10 w-6 rounded bg-text-muted/20" />
                <div className="h-12 w-12 rounded-sm bg-text-muted/20" />
                <div className="flex-1">
                  <div className="h-3.5 w-40 rounded bg-text-muted/20" />
                  <div className="mt-2 h-3 w-24 rounded bg-text-muted/10" />
                </div>
              </li>
            ))}
          </ul>
        ) : songs.length > 0 ? (
          <ul className="divide-y divide-border overflow-hidden rounded-radius-md border border-border bg-surface shadow-card">
            {songs.map((song, index) => {
              const isActive = song.id === currentId;
              return (
                <li
                  key={song.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`播放 ${song.title}`}
                  aria-current={isActive}
                  onClick={() => player.playSong(song)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      player.playSong(song);
                    }
                  }}
                  className={`flex cursor-pointer items-center gap-4 p-4 transition-colors duration-200 ease-out ${
                    isActive ? "bg-accent-subtle" : "hover:bg-background-soft"
                  }`}
                >
                  {/* Index / EQ indicator */}
                  <div className="flex w-8 shrink-0 justify-center">
                    {isActive ? (
                      <span
                        className="flex h-4 items-end gap-[2.5px]"
                        aria-label={player.isPlaying ? "正在播放" : "已暂停"}
                      >
                        <span
                          className="eq-bar h-full w-[3px] rounded-full bg-accent"
                          style={{
                            animationDelay: "0ms",
                            animationPlayState: player.isPlaying
                              ? "running"
                              : "paused",
                          }}
                        />
                        <span
                          className="eq-bar h-full w-[3px] rounded-full bg-accent"
                          style={{
                            animationDelay: "180ms",
                            animationPlayState: player.isPlaying
                              ? "running"
                              : "paused",
                          }}
                        />
                        <span
                          className="eq-bar h-full w-[3px] rounded-full bg-accent"
                          style={{
                            animationDelay: "360ms",
                            animationPlayState: player.isPlaying
                              ? "running"
                              : "paused",
                          }}
                        />
                      </span>
                    ) : (
                      <span className="text-sm tabular-nums text-text-subtle">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  {/* Cover */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-background-soft">
                    {song.cover_url ? (
                      <Image
                        src={song.cover_url}
                        alt={song.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Music2
                          className="h-5 w-5 text-text-subtle"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </div>

                  {/* Title / Artist */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium transition-colors duration-200 ${
                        isActive ? "text-accent" : "text-text-primary"
                      }`}
                    >
                      {song.title}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {song.artist}
                    </p>
                  </div>

                  {/* Duration */}
                  <span className="shrink-0 text-sm tabular-nums text-text-subtle">
                    {formatDuration(song.duration)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-20 text-center text-text-muted">
            暂无音乐分享，敬请期待。
          </p>
        )}
      </div>
    </div>
  );
}
