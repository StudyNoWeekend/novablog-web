"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getSongPlayerUrl } from "@/lib/api/music";
import type { Song } from "@/lib/types";

export type PlayMode = "sequential" | "random" | "single";

/**
 * 构造 iframe 播放地址：
 * - t 参数：拖拽进度 / 暂停恢复时定位到指定秒
 * - autoplay：暂停时置 0（B 站 iframe 跨域无法直接遥控暂停，
 *   只能以重载方式实现），恢复/播放时置 1
 */
function buildPlayerUrl(
  baseUrl: string,
  seekSec: number | null,
  paused: boolean
): string {
  try {
    const parsed = new URL(baseUrl);
    if (seekSec != null) {
      parsed.searchParams.set("t", String(Math.max(0, Math.floor(seekSec))));
    }
    parsed.searchParams.set("autoplay", paused ? "0" : "1");
    return parsed.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * 全局音乐播放器状态。
 *
 * 音源为 B 站官方外链播放器（iframe 内嵌，跨域），无法监听
 * timeupdate/ended/pause 等事件，因此播放进度只能按歌曲时长
 * 前端估算：startSong/seekTo/恢复播放时记录计时基点，秒级
 * interval 推进，到达估算时长后按 playMode 自动切歌。
 *
 * iframe 仅作为隐藏的音频引擎（界面不展示视频），播放/暂停
 * 通过重载 iframe 实现（autoplay=0/1 + t 定位），进度条与之一致；
 * 若 iframe 内部播放器被直接操作，计时无法感知（已知取舍）。
 */
interface MusicPlayerContextValue {
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  currentSong: Song | null;
  /** iframe 播放地址（随 seek / 暂停状态变化） */
  playerUrl: string | null;
  urlLoading: boolean;
  urlError: boolean;
  /** 是否处于暂停（经播放器 UI 暂停后计时冻结） */
  isPaused: boolean;
  playMode: PlayMode;
  /** 估算播放进度（秒） */
  position: number;
  /** 每次播放动作自增，配合 iframe key 强制重载（同地址重播/seek 复位） */
  playSeq: number;
  playSong: (song: Song) => void;
  playNext: () => void;
  playPrev: () => void;
  /** 播放模式循环切换：顺序 → 随机 → 单曲 */
  cyclePlayMode: () => void;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  /** 停止播放并卸载播放器 */
  stop: () => void;
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
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [seekSec, setSeekSec] = useState<number | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("sequential");
  const [position, setPosition] = useState(0);
  const [playSeq, setPlaySeq] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const currentSong = useMemo(
    () => playlist.find((s) => s.id === currentId) ?? null,
    [playlist, currentId]
  );
  const currentIndex = playlist.findIndex((s) => s.id === currentId);
  const duration = currentSong?.duration ?? 0;

  // 计时基点：position = basePos + (now - baseTime)，基于墙钟可在
  // 后台标签页被节流后自动追平进度；positionRef 为其镜像，
  // 供计时器在暂停恢复后从冻结位置续走
  const basePosRef = useRef(0);
  const baseTimeRef = useRef(0);
  const positionRef = useRef(0);

  const playerUrl = useMemo(() => {
    if (!baseUrl) return null;
    return buildPlayerUrl(baseUrl, seekSec, isPaused);
  }, [baseUrl, seekSec, isPaused]);

  // Fetch the iframe player url whenever song changes.
  // 加载/错误态的重置都在事件处理器中同步完成，effect 内只做异步取数，
  // 避免在 effect 中直接 setState。
  useEffect(() => {
    if (!currentId) return;

    let cancelled = false;
    getSongPlayerUrl(currentId).then((url) => {
      if (cancelled) return;
      if (url) {
        setBaseUrl(url);
      } else {
        setUrlError(true);
      }
      setUrlLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [currentId, reloadKey]);

  const startSong = useCallback((id: string) => {
    setCurrentId(id);
    setBaseUrl(null);
    setSeekSec(null);
    setUrlLoading(true);
    setUrlError(false);
    setIsPaused(false);
    basePosRef.current = 0;
    baseTimeRef.current = Date.now();
    positionRef.current = 0;
    setPosition(0);
    setPlaySeq((seq) => seq + 1);
  }, []);

  /** 暂停：冻结计时基点，iframe 以 autoplay=0 + t 定位重载，停在当前位置 */
  const pause = useCallback(() => {
    const exact =
      basePosRef.current + (Date.now() - baseTimeRef.current) / 1000;
    const frozen =
      duration > 0 ? Math.min(exact, duration) : Math.max(0, exact);
    basePosRef.current = frozen;
    baseTimeRef.current = Date.now();
    positionRef.current = frozen;
    setPosition(frozen);
    setSeekSec(frozen);
    setIsPaused(true);
  }, [duration]);

  /** 恢复：iframe 以 autoplay=1 + 当前位置重载，计时从冻结位置续走 */
  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isPaused, pause, resume]);

  const playSong = useCallback(
    (song: Song) => {
      if (song.id === currentId) {
        // 点击当前歌曲：切换播放/暂停
        togglePlay();
        return;
      }
      startSong(song.id);
    },
    [currentId, startSong, togglePlay]
  );

  const playIndex = useCallback(
    (index: number) => {
      const song = playlist[index];
      if (song) startSong(song.id);
    },
    [playlist, startSong]
  );

  const playRandom = useCallback(() => {
    if (playlist.length === 0) return;
    if (playlist.length === 1) {
      startSong(playlist[0].id);
      return;
    }
    let index = currentIndex;
    while (index === currentIndex) {
      index = Math.floor(Math.random() * playlist.length);
    }
    playIndex(index);
  }, [playlist, currentIndex, playIndex, startSong]);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    if (playMode === "random") {
      playRandom();
      return;
    }
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % playlist.length;
    playIndex(nextIndex);
  }, [playlist, playMode, currentIndex, playRandom, playIndex]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    if (playMode === "random") {
      playRandom();
      return;
    }
    const prevIndex =
      currentIndex < 0 ? 0 : (currentIndex - 1 + playlist.length) % playlist.length;
    playIndex(prevIndex);
  }, [playlist, playMode, currentIndex, playRandom, playIndex]);

  const cyclePlayMode = useCallback(() => {
    setPlayMode((mode) =>
      mode === "sequential" ? "random" : mode === "random" ? "single" : "sequential"
    );
  }, []);

  const seekTo = useCallback(
    (seconds: number) => {
      if (!currentId) return;
      const clamped =
        duration > 0 ? Math.max(0, Math.min(seconds, duration)) : Math.max(0, seconds);
      basePosRef.current = clamped;
      baseTimeRef.current = Date.now();
      positionRef.current = clamped;
      setPosition(clamped);
      setSeekSec(clamped);
      setPlaySeq((seq) => seq + 1);
    },
    [currentId, duration]
  );

  const stop = useCallback(() => {
    setCurrentId(null);
    setBaseUrl(null);
    setSeekSec(null);
    setUrlLoading(false);
    setUrlError(false);
    setIsPaused(false);
    positionRef.current = 0;
    setPosition(0);
  }, []);

  const retry = useCallback(() => {
    setUrlError(false);
    setUrlLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  // 到达估算时长后的自动切歌。用 ref 保存最新处理器，避免 interval 闭包
  // 过期（playMode/playlist 若放进 interval effect 依赖会反复重置计时基点）。
  // 所有分支都必须重置计时基点：列表只有一首歌时 startSong 不会改变
  // currentId，interval 不会重建，基点不重置会导致连续触发。
  const endHandlerRef = useRef<() => void>(() => {});
  useEffect(() => {
    endHandlerRef.current = () => {
      if (playMode === "single") {
        setSeekSec(null);
        setIsPaused(false);
        basePosRef.current = 0;
        baseTimeRef.current = Date.now();
        positionRef.current = 0;
        setPosition(0);
        setPlaySeq((seq) => seq + 1);
        return;
      }
      if (playMode === "random") {
        playRandom();
        return;
      }
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % playlist.length;
      playIndex(nextIndex);
    };
  });

  // 估算进度计时器：有时长且未暂停时启动；暂停期间音乐与计时一起冻结，
  // 也不会触发自动切歌。duration<=0 时回退纯手动切歌。
  useEffect(() => {
    if (!currentId || duration <= 0 || isPaused) return;

    basePosRef.current = positionRef.current;
    baseTimeRef.current = Date.now();
    const timer = setInterval(() => {
      const elapsed =
        basePosRef.current + (Date.now() - baseTimeRef.current) / 1000;
      if (elapsed >= duration) {
        setPosition(duration);
        positionRef.current = duration;
        endHandlerRef.current();
      } else {
        setPosition(elapsed);
        positionRef.current = elapsed;
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentId, duration, isPaused]);

  return (
    <MusicPlayerContext.Provider
      value={{
        playlist,
        setPlaylist,
        currentSong,
        playerUrl,
        urlLoading,
        urlError,
        isPaused,
        playMode,
        position,
        playSeq,
        playSong,
        playNext,
        playPrev,
        cyclePlayMode,
        togglePlay,
        seekTo,
        stop,
        retry,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}
