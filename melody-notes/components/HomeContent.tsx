"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, RefreshCw } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { BloggerCard } from "@/components/BloggerCard";
import { HeroSection } from "@/components/HeroSection";
import { PlaylistSidebarItem } from "@/components/PlaylistCard";
import { useMusicPlayer } from "@/components/MusicPlayerProvider";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getSongs, getPlaylists } from "@/lib/api/music";
import { getModuleConfig } from "@/lib/api/module-config";
import type { Article, ModuleConfig, Playlist, Song } from "@/lib/types";

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** 洗牌：Fisher–Yates，不修改原数组 */
function shuffled<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ALL_ENABLED: ModuleConfig = {
  article_enabled: true,
  media_enabled: true,
  music_enabled: true,
  video_enabled: true,
  travel_enabled: true,
  portfolio_enabled: true,
  equipment_enabled: true,
  updated_at: "",
};

export function HomeContent() {
  const player = useMusicPlayer();
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesTotal, setArticlesTotal] = useState<number | undefined>(undefined);
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [modules, setModules] = useState<ModuleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  /** 换一换：递增触发重新洗牌 */
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, a, so, pl, m] = await Promise.all([
        getBloggerProfile(),
        getArticles({ page: 1, page_size: 3 }),
        getSongs({ page: 1, page_size: 50 }),
        getPlaylists(),
        getModuleConfig(),
      ]);
      if (cancelled) return;
      setProfile(p);
      setArticles(a.list);
      setArticlesTotal(a.total);
      setSongs(so.list);
      setPlaylists(pl.slice(0, 4));
      setModules(m);

      // 动态设置 favicon 与页面标题，弥补静态导出下 generateMetadata 无法获取资料的限制
      if (p?.blog_icon) {
        let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = p.blog_icon;
      }
      if (p?.blog_title) {
        document.title = p.blog_title;
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 今日推荐：随机一位今日主角 + 后续曲目榜（点「换一换」重新洗牌）
  const todaySongs = useMemo(() => {
    if (songs.length === 0) return [];
    return shuffled(songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs, shuffleKey]);
  const featured = todaySongs[0] ?? null;
  const trackList = todaySongs.slice(0, 5);

  // 点击首页歌曲时，将完整曲库设为播放队列，便于迷你播放器上下曲切换
  const handlePlaySong = useCallback(
    (song: Song) => {
      player.setPlaylist(songs);
      player.playSong(song);
    },
    [player, songs]
  );

  const showMusic = !modules || modules.music_enabled;
  const showArticles = !modules || modules.article_enabled;

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection profile={profile} />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 md:py-16 lg:grid lg:grid-cols-3 lg:gap-10 lg:px-8">
        {/* 主栏 */}
        <div className="min-w-0 lg:col-span-2">
          {/* 今日推荐 */}
          {showMusic && (
            <section aria-labelledby="today-title">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 id="today-title" className="text-2xl font-bold text-text-primary md:text-[1.7rem]">
                  今日推荐
                  <span className="ml-3 align-middle text-sm font-normal text-text-muted">
                    一首歌，治愈今天的你。
                  </span>
                </h2>
                {songs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShuffleKey((k) => k + 1)}
                    className="flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border px-3.5 text-sm text-text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent"
                  >
                    换一换
                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="aspect-[4/3] animate-pulse rounded-xl bg-surface md:col-span-2" />
                  <div className="h-64 animate-pulse rounded-xl bg-surface md:col-span-3" />
                </div>
              ) : featured ? (
                <div className="grid gap-4 md:grid-cols-5">
                  {/* 今日主角 */}
                  <button
                    type="button"
                    onClick={() => handlePlaySong(featured)}
                    aria-label={`播放 ${featured.title}`}
                    className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-border bg-surface text-left md:col-span-2"
                  >
                    {featured.cover_url ? (
                      <Image
                        src={featured.cover_url}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-full w-full bg-[radial-gradient(120%_120%_at_50%_0%,#1d3a2c_0%,#12241c_70%)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                    <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-strong/95 text-on-accent shadow-glow transition-transform duration-200 group-hover:scale-110">
                      {player.currentSong?.id === featured.id ? (
                        // iframe 内无法感知播放状态，静态音柱仅表示"当前歌曲"
                        <span className="flex h-4 items-end gap-[2.5px]" aria-hidden="true">
                          <span className="h-[45%] w-[3px] rounded-sm bg-current" />
                          <span className="h-full w-[3px] rounded-sm bg-current" />
                          <span className="h-[70%] w-[3px] rounded-sm bg-current" />
                        </span>
                      ) : (
                        <Play className="ml-1 h-6 w-6 fill-current" strokeWidth={1.5} />
                      )}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="truncate text-lg font-bold text-white">
                        《{featured.title}》
                      </h3>
                      <p className="mt-0.5 truncate text-sm text-white/70">{featured.artist}</p>
                      <p className="mt-2 text-xs text-white/50">—— 今日推荐</p>
                    </div>
                  </button>

                  {/* 曲目榜 */}
                  <ol className="overflow-hidden rounded-xl border border-border bg-surface md:col-span-3">
                    {trackList.map((song, i) => {
                      const isCurrent = player.currentSong?.id === song.id;
                      return (
                        <li key={song.id}>
                          <button
                            type="button"
                            onClick={() => handlePlaySong(song)}
                            aria-label={`播放 ${song.title}`}
                            className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 ${
                              i > 0 ? "border-t border-border" : ""
                            } ${isCurrent ? "bg-accent-subtle" : "hover:bg-surface-elevated"}`}
                          >
                            <span
                              className={`w-7 shrink-0 text-sm font-semibold tabular-nums ${
                                isCurrent ? "text-accent" : "text-text-subtle"
                              }`}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className={`block truncate text-sm font-medium ${
                                  isCurrent ? "text-accent" : "text-text-primary"
                                }`}
                              >
                                {song.title}
                              </span>
                              <span className="block truncate text-xs text-text-subtle">
                                {song.artist}
                              </span>
                            </span>
                            {isCurrent ? (
                              // iframe 内无法感知播放状态，静态音柱仅表示"当前歌曲"
                              <span className="flex h-4 shrink-0 items-end gap-[2px]" aria-label="当前歌曲">
                                <span className="h-[45%] w-[3px] rounded-sm bg-accent" />
                                <span className="h-full w-[3px] rounded-sm bg-accent" />
                                <span className="h-[70%] w-[3px] rounded-sm bg-accent" />
                              </span>
                            ) : null}
                            <span className="shrink-0 text-xs tabular-nums text-text-subtle">
                              {formatDuration(song.duration)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-surface/50 px-6 py-10 text-center text-sm text-text-muted">
                  博主还没有上架歌曲，先去逛逛{" "}
                  <Link href="/articles" className="text-accent hover:underline">
                    文章
                  </Link>
                  吧
                </div>
              )}
            </section>
          )}

          {/* 最新文章 */}
          {showArticles && (
            <section aria-labelledby="latest-articles-title" className="mt-14">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 id="latest-articles-title" className="text-2xl font-bold text-text-primary md:text-[1.7rem]">
                  最新文章
                  <span className="ml-3 align-middle text-sm font-normal text-text-muted">
                    关于音乐、关于生活、也关于你我。
                  </span>
                </h2>
                <Link
                  href="/articles"
                  className="flex shrink-0 cursor-pointer items-center gap-0.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                >
                  更多文章
                  <span aria-hidden="true">&nbsp;&gt;</span>
                </Link>
              </div>

              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-xl bg-surface">
                      <div className="aspect-[16/10] rounded-t-xl bg-surface-elevated" />
                      <div className="space-y-2 p-5">
                        <div className="h-4 w-3/4 rounded bg-surface-elevated" />
                        <div className="h-3 w-full rounded bg-surface-elevated" />
                        <div className="h-3 w-2/3 rounded bg-surface-elevated" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : articles.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-surface/50 px-6 py-10 text-center text-sm text-text-muted">
                  还没有发布文章，敬请期待
                </div>
              )}
            </section>
          )}

          {/* 数据一览（移动端：侧栏卡片在下方补位） */}
          <div className="mt-14 space-y-6 lg:hidden">
            <BloggerCard
              profile={profile}
              stats={{
                articles: articlesTotal,
                songs: songs.length,
                playlists: playlists.length,
              }}
            />
            {showMusic && playlists.length > 0 && (
              <HotPlaylists playlists={playlists} />
            )}
          </div>
        </div>

        {/* 侧栏（桌面端） */}
        <aside className="mt-14 hidden min-w-0 space-y-6 lg:mt-0 lg:block">
          <BloggerCard
            profile={profile}
            stats={{
              articles: articlesTotal,
              songs: songs.length,
              playlists: playlists.length,
            }}
          />
          {showMusic && playlists.length > 0 && <HotPlaylists playlists={playlists} />}
        </aside>
      </div>
    </div>
  );
}

/** 热门歌单（侧栏卡片） */
function HotPlaylists({ playlists }: { playlists: Playlist[] }) {
  return (
    <section
      aria-labelledby="hot-playlists-title"
      className="rounded-xl border border-border bg-surface p-4 shadow-card"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 id="hot-playlists-title" className="text-base font-bold text-text-primary">
          热门歌单
        </h2>
        <Link
          href="/playlists"
          className="cursor-pointer text-xs text-text-subtle transition-colors duration-200 hover:text-accent"
        >
          更多 &gt;
        </Link>
      </div>
      <div>
        {playlists.map((playlist) => (
          <PlaylistSidebarItem key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </section>
  );
}
