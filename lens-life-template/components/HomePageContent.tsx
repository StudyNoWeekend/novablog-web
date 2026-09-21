"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Images } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { EquipmentCard } from "@/components/EquipmentCard";
import { HeroSection } from "@/components/HeroSection";
import { SongCard } from "@/components/SongCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { useMusicPlayer } from "@/components/MusicPlayerProvider";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getEquipments } from "@/lib/api/equipments";
import { getPortfolios } from "@/lib/api/portfolios";
import { getSongs, getPlaylists } from "@/lib/api/music";
import { getModuleConfig } from "@/lib/api/module-config";
import type { ModuleConfig } from "@/lib/types";
import type {
  Article,
  Equipment,
  Portfolio,
  Song,
  Playlist,
  Paginated,
} from "@/lib/types";

export function HomePageContent() {
  const player = useMusicPlayer();
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [articlesData, setArticlesData] = useState<Paginated<Article>>({ list: [], total: 0, page: 1, page_size: 4, total_pages: 0 });
  const [moduleConfig, setModuleConfig] = useState<ModuleConfig | null>(null);
  const [equipmentsData, setEquipmentsData] = useState<Paginated<Equipment>>({ list: [], total: 0, page: 1, page_size: 5, total_pages: 0 });
  const [portfoliosData, setPortfoliosData] = useState<Paginated<Portfolio>>({ list: [], total: 0, page: 1, page_size: 5, total_pages: 0 });
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, a, m, e, po, so, pl] = await Promise.all([
        getBloggerProfile(),
        getArticles({ page: 1, page_size: 4 }),
        getModuleConfig(),
        getEquipments({ page: 1, page_size: 5 }),
        getPortfolios({ page: 1, page_size: 5 }),
        getSongs({ page: 1, page_size: 4 }),
        getPlaylists(),
      ]);
      setProfile(p);
      setArticlesData(a);
      setModuleConfig(m);
      setEquipmentsData(e);
      setPortfoliosData(po);
      setSongs(so.list);
      setPlaylists(pl.slice(0, 4));

      // 动态设置 favicon 与页面标题，弥补静态导出下 generateMetadata 无法获取个人资料的限制
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载首页失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const latestArticles = articlesData.list;
  const equipments = equipmentsData.list;
  const portfolioPreview = portfoliosData.list;
  // 未加载完成时回退为全部开启，保证 Navbar 显示完整
  const modules = moduleConfig ?? {
    article_enabled: true,
    media_enabled: true,
    music_enabled: true,
    video_enabled: true,
    travel_enabled: true,
    portfolio_enabled: true,
    equipment_enabled: true,
    updated_at: "",
  };

  // 点击首页歌曲时，将首页歌曲列表设为播放队列，便于迷你播放器上下曲切换
  const handlePlaySong = useCallback(
    (song: Song) => {
      player.setPlaylist(songs);
      player.playSong(song);
    },
    [player, songs]
  );

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24">
        <p className="mb-4 text-text-muted">{error}</p>
        <button
          type="button"
          onClick={loadData}
          className="cursor-pointer rounded-radius-md bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero Section */}
      <HeroSection profile={profile} />

      {/* Latest Articles Section */}
      {!loading && modules.article_enabled && latestArticles.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary md:text-3xl">
                最新文章
              </h2>
              <Link
                href="/articles"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 ease-out hover:text-accent"
              >
                查看全部文章
                <span>&gt;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Equipment Section */}
      {!loading && modules.equipment_enabled && equipments.length > 0 && (
        <section className="bg-background-soft py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary md:text-3xl">
                设备
              </h2>
              <Link
                href="/gear"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 ease-out hover:text-accent"
              >
                查看全部设备
                <span>&gt;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {equipments.map((equipment) => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Preview Section */}
      {!loading && modules.portfolio_enabled && portfolioPreview.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary md:text-3xl">
                作品集
              </h2>
              <Link
                href="/portfolio"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 ease-out hover:text-accent"
              >
                查看全部作品集
                <span>&gt;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {portfolioPreview.map((portfolio) => (
                <Link
                  key={portfolio.id}
                  href="/portfolio"
                  className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-radius-md bg-surface"
                >
                  {portfolio.cover_url ? (
                    <Image
                      src={portfolio.cover_url}
                      alt={portfolio.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Images
                        className="h-8 w-8 text-text-subtle"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                    <h3 className="font-[var(--font-playfair)] text-base font-semibold text-text-primary">
                      {portfolio.name}
                    </h3>
                    <p className="mt-1 text-xs text-text-muted">
                      {portfolio.item_count} 张作品
                      {portfolio.category_name
                        ? ` · ${portfolio.category_name}`
                        : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Music Section */}
      {!loading && modules.music_enabled && songs.length > 0 && (
        <section className="bg-background-soft py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary md:text-3xl">
                最新音乐
              </h2>
              <Link
                href="/music"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 ease-out hover:text-accent"
              >
                查看全部音乐
                <span>&gt;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Playlists Section */}
      {!loading && modules.music_enabled && playlists.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary md:text-3xl">
                音乐歌单
              </h2>
              <Link
                href="/music"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 ease-out hover:text-accent"
              >
                查看全部歌单
                <span>&gt;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading skeleton for content sections */}
      {loading && (
        <div className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 h-8 w-32 animate-pulse rounded-md bg-text-muted/20" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-radius-md bg-text-muted/10"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
