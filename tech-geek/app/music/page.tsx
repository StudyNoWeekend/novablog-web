"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Music, Disc, Clock, AlertCircle } from "lucide-react";
import { music, getModuleConfig, Song } from "@/lib/api";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { Button } from "@/components/ui/button";

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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    setAudioError(null);
    if (currentSong?.id === song.id) {
      if (playing) {
        audioRef.current?.pause();
        setPlaying(false);
      } else {
        audioRef.current?.play().catch((err) => setAudioError(err.message));
        setPlaying(true);
      }
      return;
    }

    try {
      const res = await music.audioUrl(song.id);
      setCurrentSong(song);
      setAudioUrl(res.url);
      setPlaying(true);
      setCurrentTime(0);
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : "获取音频地址失败");
    }
  };

  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => setPlaying(false);
    const onError = () => setAudioError("音频播放失败，请检查网络或链接有效性");

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    audio.play().catch((err) => setAudioError(err.message));

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [audioUrl]);

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

      {/* Player */}
      {currentSong && (
        <div className="mb-8 rounded-lg border border-border bg-card p-4 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
              {currentSong.cover_url ? (
                <Image
                  src={currentSong.cover_url}
                  alt={currentSong.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Disc className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{currentSong.title}</p>
              <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePlay(currentSong)}
                  className="h-10 w-10 cursor-pointer"
                  aria-label={playing ? "暂停" : "播放"}
                >
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <div className="flex-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration || currentSong.duration)}</span>
                  </div>
                </div>
              </div>
              {audioError && (
                <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {audioError}
                </p>
              )}
            </div>
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
                    {isCurrent && playing ? (
                      <span className="inline-flex h-4 items-end gap-0.5">
                        <span className="w-0.5 animate-[bounce_1s_infinite] bg-primary" style={{ height: "60%" }} />
                        <span className="w-0.5 animate-[bounce_1.2s_infinite] bg-primary" style={{ height: "100%" }} />
                        <span className="w-0.5 animate-[bounce_0.8s_infinite] bg-primary" style={{ height: "80%" }} />
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
