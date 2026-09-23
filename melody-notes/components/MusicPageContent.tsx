"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Music2, Play, Search } from "lucide-react";
import { useMusicPlayer } from "@/components/MusicPlayerProvider";
import { getSongs } from "@/lib/api/music";
import type { Song } from "@/lib/types";

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MusicPageContent() {
  const player = useMusicPlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let cancelled = false;
    getSongs({ page: 1, page_size: 100 }).then((data) => {
      if (cancelled) return;
      setSongs(data.list);
      setTotal(data.total);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    );
  }, [songs, keyword]);

  const handlePlay = (song: Song) => {
    player.setPlaylist(filtered);
    player.playSong(song);
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
            音乐推荐
            <span className="ml-3 align-middle text-base font-normal text-text-muted">
              每一首，都值得戴上耳机。
            </span>
          </h1>

          <div className="mt-7 flex max-w-md items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <label htmlFor="music-search" className="sr-only">
                搜索歌曲或歌手
              </label>
              <input
                id="music-search"
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索歌曲或歌手…"
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Song list */}
      <section className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-sm text-text-subtle">
            共 <span className="tabular-nums text-text-muted">{total}</span> 首歌曲
            {keyword.trim() && (
              <>
                ，匹配到 <span className="tabular-nums text-text-muted">{filtered.length}</span> 首
              </>
            )}
          </p>

          {loading ? (
            <ul className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <li
                  key={i}
                  className="flex h-20 animate-pulse items-center gap-4 rounded-xl bg-surface px-4"
                />
              ))}
            </ul>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
              <Music2 className="mx-auto h-10 w-10 text-text-subtle" strokeWidth={1.5} />
              <p className="mt-4 text-sm text-text-muted">
                {keyword.trim() ? "没有找到匹配的歌曲，换个关键词试试" : "还没有上架歌曲"}
              </p>
            </div>
          ) : (
            <ol className="overflow-hidden rounded-xl border border-border bg-surface">
              {filtered.map((song, i) => {
                const isCurrent = player.currentSong?.id === song.id;
                return (
                  <li key={song.id} className={i > 0 ? "border-t border-border" : ""}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handlePlay(song)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handlePlay(song);
                        }
                      }}
                      className={`flex cursor-pointer items-center gap-4 px-4 py-3.5 transition-colors duration-150 ${
                        isCurrent ? "bg-accent-subtle" : "hover:bg-surface-elevated"
                      }`}
                    >
                      {/* 序号 / 播放态 */}
                      <span
                        className={`w-7 shrink-0 text-center text-sm font-semibold tabular-nums ${
                          isCurrent ? "text-accent" : "text-text-subtle"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* 封面 */}
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-elevated">
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
                          <div className="flex h-full w-full items-center justify-center">
                            <Music2 className="h-5 w-5 text-text-subtle" strokeWidth={1.5} />
                          </div>
                        )}
                        <span
                          className={`absolute inset-0 flex items-center justify-center bg-black/45 transition-opacity duration-200 ${
                            isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {isCurrent ? (
                            // iframe 内无法感知播放状态，静态音柱仅表示"当前歌曲"
                            <span className="flex h-4 items-end gap-[2px]" aria-hidden="true">
                              <span className="h-[45%] w-[3px] rounded-sm bg-white" />
                              <span className="h-full w-[3px] rounded-sm bg-white" />
                              <span className="h-[70%] w-[3px] rounded-sm bg-white" />
                            </span>
                          ) : (
                            <Play className="ml-0.5 h-4 w-4 fill-current text-white" />
                          )}
                        </span>
                      </div>

                      {/* 标题 / 歌手 */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-medium ${
                            isCurrent ? "text-accent" : "text-text-primary"
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="truncate text-xs text-text-subtle">{song.artist}</p>
                      </div>

                      {/* 当前歌曲标识 */}
                      {isCurrent ? (
                        // iframe 内无法感知播放状态，静态音柱仅表示"当前歌曲"
                        <span className="flex h-4 shrink-0 items-end gap-[2px]" aria-label="当前歌曲">
                          <span className="h-[45%] w-[3px] rounded-sm bg-accent" />
                          <span className="h-full w-[3px] rounded-sm bg-accent" />
                          <span className="h-[70%] w-[3px] rounded-sm bg-accent" />
                        </span>
                      ) : null}

                      {/* 时长 */}
                      <span className="w-12 shrink-0 text-right text-xs tabular-nums text-text-subtle">
                        {formatDuration(song.duration)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
