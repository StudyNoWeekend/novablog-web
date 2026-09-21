"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Music2, ExternalLink, Headphones, ListMusic } from "lucide-react";
import { getSongs, getPlaylists } from "@/lib/api/music";
import { useMusicPlayer } from "@/components/MusicPlayerProvider";
import { PlatformBadge } from "@/components/PlaylistCard";
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
    <li className="flex animate-pulse items-center gap-4 rounded-radius-md bg-surface p-4">
      <div className="h-10 w-6 rounded bg-text-muted/20" />
      <div className="h-12 w-12 rounded-sm bg-text-muted/20" />
      <div className="flex-1">
        <div className="h-3.5 w-40 rounded bg-text-muted/20" />
        <div className="mt-2 h-3 w-24 rounded bg-text-muted/10" />
      </div>
    </li>
  );
}

function PlaylistSkeleton() {
  return (
    <div className="animate-pulse rounded-radius-lg border border-border bg-surface p-4">
      <div className="aspect-[3/2] w-full rounded-radius-md bg-text-muted/20" />
      <div className="mt-4 h-4 w-3/4 rounded bg-text-muted/20" />
      <div className="mt-2 h-3 w-1/3 rounded bg-text-muted/10" />
      <div className="mt-2 h-3 w-full rounded bg-text-muted/10" />
    </div>
  );
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <a
      href={playlist.platform_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-radius-lg border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Cover */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-radius-md bg-background-soft">
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
            <Music2 className="h-10 w-10 text-text-subtle" strokeWidth={1.5} />
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
          <h3 className="text-sm font-medium text-text-primary line-clamp-1">
            {playlist.title}
          </h3>
          <PlatformBadge platform={playlist.platform} />
        </div>
        {playlist.description && (
          <p className="text-xs text-text-muted line-clamp-2">
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

  // Playlists state
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
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

  // Fetch playlists on first switch to playlists tab
  const loadPlaylists = useCallback(async () => {
    if (playlistsLoaded) return;
    setPlaylistsLoading(true);
    const data = await getPlaylists();
    setPlaylists(data);
    setPlaylistsLoaded(true);
    setPlaylistsLoading(false);
  }, [playlistsLoaded]);

  useEffect(() => {
    if (activeTab === "playlists") {
      loadPlaylists();
    }
  }, [activeTab, loadPlaylists]);

  const currentId = player.currentSong?.id ?? null;

  const tabs: { key: Tab; label: string; icon: typeof Headphones }[] = [
    { key: "songs", label: "音乐播放", icon: Headphones },
    { key: "playlists", label: "音乐歌单", icon: ListMusic },
  ];

  return (
    <div className="flex-1 bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="font-[var(--font-heading)] text-4xl font-medium text-text-primary sm:text-5xl">
            音乐分享
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted" />
        </header>

        {/* Tab switcher */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-radius-md border border-border bg-surface p-1 shadow-card">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex cursor-pointer items-center gap-2 rounded-radius-sm px-5 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-accent text-black shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
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
                        isActive
                          ? "bg-accent-subtle"
                          : "hover:bg-background-soft"
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
                            referrerPolicy="no-referrer"
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
    </div>
  );
}
