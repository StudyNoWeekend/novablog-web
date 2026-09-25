"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, ListMusic, Music2, Play, Pause } from "lucide-react";
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

const PLATFORM_BADGE_STYLES: Record<string, string> = {
  bilibili: "bg-sky-subtle text-sky",
  netease: "bg-red-50 text-red-400",
  qqmusic: "bg-mint-subtle text-mint",
  ximalaya: "bg-lav-subtle text-lav-hover",
};

function PlatformBadge({ platform }: { platform: string }) {
  const label =
    platform === "bilibili"
      ? "B站"
      : platform === "netease"
        ? "网易云"
        : platform === "qqmusic"
          ? "QQ音乐"
          : platform === "ximalaya"
            ? "喜马拉雅"
            : platform;
  const style =
    PLATFORM_BADGE_STYLES[platform.toLowerCase()] ??
    "bg-background-soft text-text-muted";
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${style}`}>
      {label}
    </span>
  );
}

function SongRow({
  song,
  index,
  onPlay,
  isActive,
  isPaused,
}: {
  song: Song;
  index: number;
  onPlay: (song: Song) => void;
  isActive: boolean;
  isPaused: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onPlay(song)}
        className={`group flex min-h-16 w-full cursor-pointer items-center gap-4 rounded-radius-md border px-4 py-3 text-left transition-all duration-200 ${
          isActive
            ? "border-accent/40 bg-accent-subtle"
            : "border-transparent hover:border-accent/25 hover:bg-surface"
        }`}
      >
        <span
          className={`w-6 shrink-0 text-center font-heading text-sm ${
            isActive ? "text-accent" : "text-text-subtle"
          }`}
        >
          {index + 1}
        </span>
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-background-soft">
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
              <Music2 className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm font-medium ${
              isActive ? "text-accent-hover" : "text-text-primary"
            }`}
          >
            {song.title}
          </p>
          <p className="truncate text-xs text-text-muted">{song.artist}</p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-text-subtle">
          {formatDuration(song.duration)}
        </span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            isActive
              ? "bg-accent text-white"
              : "bg-background-soft text-text-muted group-hover:bg-accent group-hover:text-white"
          }`}
        >
          {isActive && !isPaused ? (
            <Pause className="h-4 w-4 fill-current" strokeWidth={1.5} />
          ) : (
            <Play className="h-4 w-4 translate-x-px fill-current" strokeWidth={1.5} />
          )}
        </span>
      </button>
    </li>
  );
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <a
      href={playlist.platform_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-pointer rounded-radius-lg border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
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
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-night/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ExternalLink className="h-3.5 w-3.5 text-white" strokeWidth={2} />
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-medium text-text-primary">
            {playlist.title}
          </h3>
          <PlatformBadge platform={playlist.platform} />
        </div>
        {playlist.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-text-muted">
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

  const [songs, setSongs] = useState<Song[]>([]);
  const [songsLoading, setSongsLoading] = useState(true);

  // 歌单（加载态由 activeTab 与 playlistsLoaded 推导，避免 effect 内 setState）
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

  // Fetch playlists lazily on first tab switch
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

  // 点击歌曲时，将歌曲列表设为播放队列，供底部播放条上下曲切换
  const handlePlaySong = (song: Song) => {
    player.setPlaylist(songs);
    player.playSong(song);
  };

  const playlistsLoading = activeTab === "playlists" && !playlistsLoaded;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      {/* Tabs */}
      <div className="mb-8 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("songs")}
          aria-pressed={activeTab === "songs"}
          className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-200 ${
            activeTab === "songs"
              ? "bg-accent text-white shadow-md shadow-accent/25"
              : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
          }`}
        >
          <Music2 className="h-4 w-4" strokeWidth={1.5} />
          歌曲列表
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("playlists")}
          aria-pressed={activeTab === "playlists"}
          className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-200 ${
            activeTab === "playlists"
              ? "bg-accent text-white shadow-md shadow-accent/25"
              : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
          }`}
        >
          <ListMusic className="h-4 w-4" strokeWidth={1.5} />
          第三方歌单
        </button>
      </div>

      {/* Songs */}
      {activeTab === "songs" &&
        (songsLoading ? (
          <ul className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="h-16 animate-pulse rounded-radius-md bg-surface"
              />
            ))}
          </ul>
        ) : songs.length === 0 ? (
          <div className="rounded-radius-md border border-dashed border-border py-20 text-center">
            <Music2 className="mx-auto h-10 w-10 text-text-subtle" strokeWidth={1.5} />
            <p className="mt-4 font-heading text-text-muted">
              还没有上传歌曲，敬请期待～
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {songs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                onPlay={handlePlaySong}
                isActive={player.currentSong?.id === song.id}
                isPaused={player.isPaused}
              />
            ))}
          </ul>
        ))}

      {/* Playlists */}
      {activeTab === "playlists" &&
        (playlistsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-radius-lg border border-border bg-surface p-4"
              >
                <div className="aspect-[3/2] w-full rounded-radius-md bg-text-muted/15" />
                <div className="mt-4 h-4 w-3/4 rounded bg-text-muted/15" />
              </div>
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="rounded-radius-md border border-dashed border-border py-20 text-center">
            <ListMusic className="mx-auto h-10 w-10 text-text-subtle" strokeWidth={1.5} />
            <p className="mt-4 font-heading text-text-muted">
              还没有收藏歌单，敬请期待～
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ))}
    </div>
  );
}
