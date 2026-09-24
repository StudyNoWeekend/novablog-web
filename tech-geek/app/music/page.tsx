"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music, Clock } from "lucide-react";
import { music, getModuleConfig, Song } from "@/lib/api";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { useMusicPlayer } from "@/components/music-player-provider";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPage() {
  const player = useMusicPlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // 播放交给全局底部播放器（隐藏 iframe 音源），页面只负责列表与队列
  const handlePlay = (song: Song) => {
    player.setPlaylist(songs);
    player.playSong(song);
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

      {/* Song list */}
      {songs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          暂无歌曲
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <ul className="divide-y divide-border">
            {songs.map((song, index) => {
              const isCurrent = player.currentSong?.id === song.id;
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
