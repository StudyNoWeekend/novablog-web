"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music2, ExternalLink, Headphones, ListMusic } from "lucide-react";
import { getSongs, getPlaylists } from "@/lib/api/music";
import { useMusicPlayer } from "@/components/MusicPlayerProvider";
import type { Song, Playlist } from "@/lib/types";

type Tab = "songs" | "playlists";

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function SongSkeleton() {
  return (
    <li className="flex animate-pulse items-center gap-4 rounded-lg bg-surface p-4 shadow-card">
      <div className="h-10 w-6 rounded bg-text-subtle/30" />
      <div className="h-12 w-12 rounded-full bg-text-subtle/30" />
      <div className="flex-1">
        <div className="h-3.5 w-40 rounded bg-text-subtle/30" />
        <div className="mt-2 h-3 w-24 rounded bg-text-subtle/20" />
      </div>
    </li>
  );
}

function PlaylistSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-surface p-4 shadow-card">
      <div className="aspect-[3/2] w-full rounded-md bg-text-subtle/30" />
      <div className="mt-4 h-4 w-3/4 rounded bg-text-subtle/30" />
      <div className="mt-2 h-3 w-1/3 rounded bg-text-subtle/20" />
      <div className="mt-2 h-3 w-full rounded bg-text-subtle/20" />
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className="shrink-0 rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-medium text-accent-hover">
      {platform}
    </span>
  );
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <a
      href={playlist.platform_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Cover */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-background-soft">
        {playlist.cover_url ? (
          <Image
            src={playlist.cover_url}
            alt={playlist.title}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 className="h-10 w-10 text-text-subtle" strokeWidth={1.6} />
          </div>
        )}
        {/* External link indicator on hover */}
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ExternalLink className="h-3.5 w-3.5 text-white" strokeWidth={2} />
        </span>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-display text-sm text-text-primary">
            {playlist.title}
          </h3>
          <PlatformBadge platform={playlist.platform} />
        </div>
        {playlist.description && (
          <p className="line-clamp-2 text-xs text-text-muted">
            {playlist.description}
          </p>
        )}
      </div>
    </a>
  );
}

export function MusicContent() {
  const player = useMusicPlayer();
  const [activeTab, setActiveTab] = useState<Tab>("songs");

  // Songs state
  const [songs, setSongs] = useState<Song[]>([]);
  const [songsLoading, setSongsLoading] = useState(true);

  // Playlists state（加载态由 activeTab 与 playlistsLoaded 推导，避免 effect 内 setState）
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);

  // Fetch songs on mount
  useEffect(() => {
    let cancelled = false;
    getSongs({ page: 1, page_size: 100 }).then((data) => {
      if (cancelled) return;
      setSongs(data.list);
      player.setPlaylist(data.list);
      setSongsLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playlistsLoading = activeTab === "playlists" && !playlistsLoaded;

  // Fetch playlists on first switch to playlists tab
  useEffect(() => {
    if (activeTab !== "playlists" || playlistsLoaded) return;
    let cancelled = false;
    getPlaylists().then((data) => {
      if (cancelled) return;
      setPlaylists(data);
      setPlaylistsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [activeTab, playlistsLoaded]);

  const currentId = player.currentSong?.id ?? null;

  const tabs: { key: Tab; label: string; icon: typeof Headphones }[] = [
    { key: "songs", label: "音乐播放", icon: Headphones },
    { key: "playlists", label: "音乐歌单", icon: ListMusic },
  ];

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Tab switcher */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-surface p-1 shadow-card">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-accent text-white shadow-card"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Songs tab */}
        {activeTab === "songs" && (
          <>
            {songsLoading ? (
              <ul className="space-y-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <SongSkeleton key={i} />
                ))}
              </ul>
            ) : songs.length > 0 ? (
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface shadow-card">
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
                        isActive
                          ? "bg-accent-subtle"
                          : "hover:bg-background-soft"
                      }`}
                    >
                      {/* Index / Current-song indicator */}
                      <div className="flex w-8 shrink-0 justify-center">
                        {isActive ? (
                          // iframe 内无法感知播放状态，静态音柱仅表示"当前歌曲"
                          <span
                            className="flex h-4 items-end gap-[2.5px]"
                            aria-label="当前歌曲"
                          >
                            <span className="h-[45%] w-[3px] rounded-full bg-accent" />
                            <span className="h-full w-[3px] rounded-full bg-accent" />
                            <span className="h-[70%] w-[3px] rounded-full bg-accent" />
                          </span>
                        ) : (
                          <span className="text-sm tabular-nums text-text-subtle">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        )}
                      </div>

                      {/* Cover */}
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-background-soft">
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
                            <Music2
                              className="h-5 w-5 text-text-subtle"
                              strokeWidth={1.6}
                            />
                          </div>
                        )}
                      </div>

                      {/* Title / Artist */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate font-display text-sm transition-colors duration-200 ${
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
          </>
        )}

        {/* Playlists tab */}
        {activeTab === "playlists" && (
          <>
            {playlistsLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <PlaylistSkeleton key={i} />
                ))}
              </div>
            ) : playlists.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {playlists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                  />
                ))}
              </div>
            ) : (
              <p className="py-20 text-center text-text-muted">
                暂无歌单，敬请期待。
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
