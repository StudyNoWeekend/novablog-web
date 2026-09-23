"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getSongPlayerUrl } from "@/lib/api/music";
import type { Song } from "@/lib/types";

/**
 * 全局音乐播放器状态。
 *
 * 音源为 B 站官方外链播放器（iframe 内嵌，跨域），无法监听
 * timeupdate/ended/play/pause 等事件，因此不再提供播放进度、
 * seek 与外部播放/暂停控制；isPlaying 由 iframe 内部自行管理。
 * 播放结束不会自动切下一首，由用户手动切歌。
 */
interface MusicPlayerContextValue {
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  currentSong: Song | null;
  playerUrl: string | null;
  urlLoading: boolean;
  urlError: boolean;
  minimized: boolean;
  playSong: (song: Song) => void;
  playNext: () => void;
  playPrev: () => void;
  close: () => void;
  toggleMinimized: () => void;
  retry: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function useMusicPlayer(): MusicPlayerContextValue {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  }
  return ctx;
}

export function MusicPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const songId = currentId;
  const currentSong = playlist.find((s) => s.id === songId) ?? null;
  const currentIndex = playlist.findIndex((s) => s.id === songId);

  // Fetch the iframe player url whenever song changes.
  // 加载/错误态的重置都在事件处理器（startSong/close/retry）中同步完成，
  // effect 内只做异步取数，避免在 effect 中直接 setState。
  useEffect(() => {
    if (!songId) return;

    let cancelled = false;
    getSongPlayerUrl(songId).then((url) => {
      if (cancelled) return;
      if (url) {
        setPlayerUrl(url);
      } else {
        setUrlError(true);
      }
      setUrlLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [songId, reloadKey]);

  const startSong = useCallback((id: string) => {
    setCurrentId(id);
    setPlayerUrl(null);
    setUrlLoading(true);
    setUrlError(false);
    setMinimized(false);
  }, []);

  const playSong = useCallback(
    (song: Song) => {
      if (song.id === currentId) {
        // 点击当前歌曲：展开 / 收起悬浮播放器
        setMinimized((prev) => !prev);
        return;
      }
      startSong(song.id);
    },
    [currentId, startSong]
  );

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % playlist.length;
    startSong(playlist[nextIndex].id);
  }, [playlist, currentIndex, startSong]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIndex =
      currentIndex < 0 ? 0 : (currentIndex - 1 + playlist.length) % playlist.length;
    startSong(playlist[prevIndex].id);
  }, [playlist, currentIndex, startSong]);

  const close = useCallback(() => {
    setCurrentId(null);
    setPlayerUrl(null);
    setUrlLoading(false);
    setUrlError(false);
    setMinimized(false);
  }, []);

  const toggleMinimized = useCallback(() => {
    setMinimized((prev) => !prev);
  }, []);

  const retry = useCallback(() => {
    setUrlError(false);
    setUrlLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        playlist,
        setPlaylist,
        currentSong,
        playerUrl,
        urlLoading,
        urlError,
        minimized,
        playSong,
        playNext,
        playPrev,
        close,
        toggleMinimized,
        retry,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}
