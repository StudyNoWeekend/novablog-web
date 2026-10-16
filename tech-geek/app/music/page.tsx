"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music, Clock, LayoutGrid } from "lucide-react";
import { music, categories, getModuleConfig, Song, Category } from "@/lib/api";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { useMusicPlayer } from "@/components/music-player-provider";
import { cn } from "@/lib/utils";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** 分类筛选参数："all" 表示全部分类 */
type CategoryFilter = string;

export default function MusicPage() {
  const player = useMusicPlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [catList, setCatList] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<CategoryFilter>("all");
  const [songsLoading, setSongsLoading] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = async (categoryId?: CategoryFilter) => {
    const res = await music.list({
      page: 1,
      page_size: 100,
      category_id: categoryId && categoryId !== "all" ? categoryId : undefined,
    });
    return res.list ?? [];
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [list, cats, modules] = await Promise.all([
        fetchSongs(),
        categories.list("music").catch(() => [] as Category[]),
        getModuleConfig(),
      ]);
      setSongs(list);
      setCatList(cats);
      setActiveCat("all");
      setMusicEnabled(modules.music_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载歌曲失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /** 切换分类：按 category_id 重新取数，失败时保留当前列表 */
  const handleCategoryChange = async (catId: CategoryFilter) => {
    if (catId === activeCat || songsLoading) return;
    setActiveCat(catId);
    setSongsLoading(true);
    try {
      setSongs(await fetchSongs(catId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "按分类加载歌曲失败");
    } finally {
      setSongsLoading(false);
    }
  };

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
        <ErrorState title="歌曲加载失败" message={error} onRetry={fetchAll} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Music className="h-7 w-7 text-primary" aria-hidden="true" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          音乐播放器
        </h1>
      </div>

      {/* 分类筛选（后端无音乐分类数据时不展示） */}
      {catList.length > 0 && (
        <div
          className="mb-6 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="按分类筛选歌曲"
        >
          <LayoutGrid
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <CategoryChip
            label="全部"
            active={activeCat === "all"}
            onClick={() => handleCategoryChange("all")}
          />
          {catList.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.name}
              active={activeCat === cat.id}
              onClick={() => handleCategoryChange(cat.id)}
            />
          ))}
        </div>
      )}

      {/* Song list */}
      {songs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          {activeCat !== "all" ? "该分类下暂无歌曲" : "暂无歌曲"}
        </div>
      ) : (
        <div
          className={cn(
            "overflow-hidden rounded-lg border border-border transition-opacity duration-200",
            songsLoading && "pointer-events-none opacity-50"
          )}
          aria-busy={songsLoading}
        >
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

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "cursor-pointer rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "bg-primary font-medium text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
      )}
    >
      {label}
    </button>
  );
}
