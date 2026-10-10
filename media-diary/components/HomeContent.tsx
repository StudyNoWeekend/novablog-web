"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Music4 } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { DomainSection } from "@/components/DomainSection";
import { WorksSection } from "@/components/WorksSection";
import { ArticleCard } from "@/components/ArticleCard";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getVideos } from "@/lib/api/videos";
import { getSongs } from "@/lib/api/music";
import { getModuleConfig } from "@/lib/api/module-config";
import type { ModuleConfig, Article, Song } from "@/lib/types";

const ALL_ENABLED: ModuleConfig = {
  article_enabled: true,
  media_enabled: true,
  music_enabled: true,
  video_enabled: true,
  travel_enabled: true,
  portfolio_enabled: true,
  equipment_enabled: true,
  open_source_enabled: true,
  recipe_enabled: true,
  book_enabled: true,
  game_enabled: true,
  fitness_enabled: true,
  tech_stack_enabled: true,
  updated_at: "",
};

/**
 * 首页内容（纯客户端取数，构建期不依赖后端可达）：
 * Hero（深色照片背景）→ About（拍立得 + 数据卡）→ 内容领域（四张彩色卡）→ 近期作品
 */
export function HomeContent() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [modules, setModules] = useState<ModuleConfig | null>(null);
  const [videoCount, setVideoCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [articles, setArticleList] = useState<Article[]>([]);
  const [songs, setSongList] = useState<Song[]>([]);
  const [covers, setCover] = useState<{
    video?: string | null;
    article?: string | null;
    song?: string | null;
  }>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getBloggerProfile(),
      getModuleConfig(),
      getVideos({ page: 1, page_size: 1 }),
      getArticles({ page: 1, page_size: 4 }),
      getSongs({ page: 1, page_size: 3 }),
    ]).then(([p, m, v, a, s]) => {
      if (cancelled) return;
      setProfile(p);
      setModules(m);
      setVideoCount(v.total);
      setArticleCount(a.total);
      setArticleList(a.list);
      setSongList(s.list);
      setCover({
        video: v.list[0]?.cover_url ?? null,
        article: a.list[0]?.cover_image ?? null,
        song: s.list[0]?.cover_url ?? null,
      });

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
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection profile={profile} />
      <AboutSection
        profile={profile}
        stats={{
          totalWorks: videoCount + articleCount,
          videoCount,
          articleCount,
        }}
      />
      <DomainSection covers={covers} />

      {/* 图文专栏 */}
      {(modules?.article_enabled ?? true) && articles.length > 0 && (
        <section className="bg-surface-highlight py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-accent-hover" strokeWidth={1.8} />
              <h2 className="font-display text-2xl text-text-primary md:text-3xl">
                图文专栏
              </h2>
            </div>
            <div className="mb-10 flex items-end justify-between gap-4">
              <p className="text-sm text-text-muted md:text-base">
                用文字与图片记录创作与生活，共 {articleCount} 篇
              </p>
              <Link
                href="/articles"
                className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-accent-hover"
              >
                查看更多
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 音乐时刻 */}
      {(modules?.music_enabled ?? true) && songs.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center gap-2">
              <Music4 className="h-6 w-6 text-accent-hover" strokeWidth={1.8} />
              <h2 className="font-display text-2xl text-text-primary md:text-3xl">
                音乐时刻
              </h2>
            </div>
            <div className="mb-10 flex items-end justify-between gap-4">
              <p className="text-sm text-text-muted md:text-base">
                旋律是生活的另一種底色，去音乐页畅听
              </p>
              <Link
                href="/music"
                className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-accent-hover"
              >
                查看更多
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {songs.map((song) => (
                <Link
                  key={song.id}
                  href="/music"
                  className="group flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-background-soft">
                    {song.cover_url ? (
                      <Image
                        src={song.cover_url}
                        alt={song.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Music4 className="h-6 w-6 text-text-subtle" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
                      {song.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-text-muted">
                      {song.artist}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-text-primary"
                    strokeWidth={1.8}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {(modules?.video_enabled ?? true) && <WorksSection />}
    </div>
  );
}
