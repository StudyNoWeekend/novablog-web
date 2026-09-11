"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getSongAudioUrl } from "@/lib/api/music";
import type { Song } from "@/lib/types";

interface MusicPlayerContextValue {
  playlist: Song[];
  setPlaylist: (songs: Song[]) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  urlLoading: boolean;
  urlError: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  close: () => void;
  seek: (ratio: number) => void;
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songId = currentId;
  const songDuration = playlist.find((s) => s.id === songId)?.duration ?? 0;
  const currentIndex = playlist.findIndex((s) => s.id === songId);

  // Keep latest playNext without re-creating the Audio element
  const playNextRef = useRef<() => void>(() => {});

  // Fetch audio url whenever song changes
  useEffect(() => {
    if (!songId) {
      setAudioUrl(null);
      setUrlLoading(false);
      setUrlError(false);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      return;
    }

    let cancelled = false;
    setUrlLoading(true);
    setUrlError(false);
    setAudioUrl(null);
    setCurrentTime(0);
    setDuration(songDuration);

    getSongAudioUrl(songId).then((url) => {
      if (cancelled) return;
      if (url) {
        setAudioUrl(url);
      } else {
        setUrlError(true);
      }
      setUrlLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId]);

  // Create / replace the Audio element when url changes
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || songDuration || 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      playNextRef.current();
    };
    const onError = () => {
      setIsPlaying(false);
      setUrlError(true);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  const playSong = useCallback(
    (song: Song) => {
      if (song.id === currentId) {
        // Clicking the active song toggles play/pause
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }
      setCurrentId(song.id);
    },
    [currentId]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % playlist.length;
    setCurrentId(playlist[nextIndex].id);
  }, [playlist, currentIndex]);

  playNextRef.current = playNext;

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIndex =
      currentIndex < 0 ? 0 : (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentId(playlist[prevIndex].id);
  }, [playlist, currentIndex]);

  const close = useCallback(() => {
    setCurrentId(null);
  }, []);

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || !Number.isFinite(audio.duration)) return;
    const clamped = Math.min(Math.max(ratio, 0), 1);
    audio.currentTime = clamped * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  const currentSong = playlist.find((s) => s.id === songId) ?? null;

  return (
    <MusicPlayerContext.Provider
      value={{
        playlist,
        setPlaylist,
        currentSong,
        isPlaying,
        currentTime,
        duration: duration || songDuration,
        urlLoading,
        urlError,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        close,
        seek,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}
