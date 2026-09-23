"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Clapperboard, Gamepad2, Tv } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { VideoCard } from "@/components/VideoCard";
import { CategoryCard } from "@/components/CategoryCard";
import { AboutCard } from "@/components/AboutCard";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getVideos } from "@/lib/api/videos";
import { getGames } from "@/lib/api/games";
import { getCategories } from "@/lib/api/categories";
import { getModuleConfig } from "@/lib/api/module-config";
import type { ModuleConfig, Video, Category } from "@/lib/types";

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

export function HomePageContent() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoTotal, setVideoTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [gameTotal, setGameTotal] = useState(0);
  const [articleTotal, setArticleTotal] = useState(0);
  const [moduleConfig, setModuleConfig] = useState<ModuleConfig>(ALL_ENABLED);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, articlesData, videosData, categoriesData, gamesData, modules] =
        await Promise.all([
          getBloggerProfile(),
          getArticles({ page: 1, page_size: 100 }),
          getVideos({ page: 1, page_size: 4 }),
          getCategories(),
          getGames({ page: 1, page_size: 1 }),
          getModuleConfig(),
        ]);
      setProfile(p);
      setArticleTotal(articlesData.total);

      // 分类内容数：基于最近 100 篇文章统计（超过 100 篇时展示分类描述兜底）
      const counts: Record<string, number> = {};
      articlesData.list.forEach((a) => {
        if (!a.category_id) return;
        counts[a.category_id] = (counts[a.category_id] ?? 0) + 1;
      });
      const counted = articlesData.total > articlesData.list.length;
      setCategoryCounts(counted ? {} : counts);

      setVideos(videosData.list);
      setVideoTotal(videosData.total);
      setCategories(categoriesData.slice(0, 5));
      setGameTotal(gamesData.total);
      setModuleConfig(modules);

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

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24">
        <p className="mb-4 text-text-muted">{error}</p>
        <button
          type="button"
          onClick={loadData}
          className="cursor-pointer rounded-full bg-gradient-theme px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          重试
        </button>
      </div>
    );
  }

  const showVideos = moduleConfig.video_enabled && videos.length > 0;
  const showCategories = moduleConfig.article_enabled && categories.length > 0;

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero Section */}
      <HeroSection profile={profile} />

      {/* Latest Videos Section */}
      {!loading && showVideos && (
        <section className="bg-background-soft py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-theme">
                  <Tv className="h-5 w-5 text-white" strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-heading text-xl font-extrabold text-text-primary md:text-2xl">
                    最新视频
                  </h2>
                  <p className="mt-0.5 text-xs text-text-muted md:text-sm">
                    高质量游戏实况 &amp; 评测，带你沉浸式体验游戏世界
                  </p>
                </div>
              </div>
              <Link
                href="/videos"
                className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-semibold text-text-muted transition-colors duration-200 ease-out hover:text-accent-hover"
              >
                查看更多
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Game Categories + About */}
      {!loading && (showCategories || moduleConfig.equipment_enabled) && (
        <section className="bg-background py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {/* Left: categories */}
              {showCategories && (
                <div className="lg:col-span-2">
                  <div className="mb-8 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-theme">
                        <Gamepad2 className="h-5 w-5 text-white" strokeWidth={1.8} />
                      </span>
                      <div>
                        <h2 className="font-heading text-xl font-extrabold text-text-primary md:text-2xl">
                          热门游戏分类
                        </h2>
                        <p className="mt-0.5 text-xs text-text-muted md:text-sm">
                          不同的游戏，同样的热爱
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/articles"
                      className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-semibold text-text-muted transition-colors duration-200 ease-out hover:text-accent-hover"
                    >
                      查看更多
                      <span aria-hidden>→</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-3">
                    {categories.map((category, index) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                        articleCount={categoryCounts[category.id]}
                      />
                    ))}
                    {/* 分类数不足 3 的倍数时补 CTA 卡，避免网格空洞 */}
                    {categories.length % 3 !== 0 && (
                      <Link
                        href="/articles"
                        className="group flex min-h-[7rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-radius-md border border-dashed border-border-strong bg-surface transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent sm:aspect-[16/9] sm:min-h-0"
                      >
                        <Gamepad2
                          className="h-7 w-7 text-accent-hover transition-transform duration-300 ease-out group-hover:scale-110"
                          strokeWidth={1.6}
                        />
                        <span className="text-sm font-bold text-text-secondary transition-colors duration-200 group-hover:text-accent-hover">
                          查看全部分类
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Right: about card */}
              <div className={showCategories ? "" : "lg:col-span-3"}>
                <AboutCard
                  profile={profile}
                  stats={{
                    articles: articleTotal,
                    videos: moduleConfig.video_enabled ? videoTotal : 0,
                    games: moduleConfig.equipment_enabled ? gameTotal : 0,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading skeleton for content sections */}
      {loading && (
        <div className="bg-background-soft py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 h-8 w-40 animate-pulse rounded-lg bg-text-muted/15" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[16/10] animate-pulse rounded-radius-md bg-text-muted/10"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA banner：鼓励投稿/交流 */}
      {!loading && (
        <section className="relative overflow-hidden border-t border-border bg-background-soft py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[100px]"
          />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Clapperboard
              className="mx-auto mb-4 h-8 w-8 text-accent-hover"
              strokeWidth={1.6}
            />
            <h2 className="font-heading text-2xl font-extrabold text-text-primary md:text-3xl">
              好的游戏，值得被更多人看见。
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-base">
              如果你也热爱游戏，欢迎观看实况、阅读攻略，一起探索更多好玩的内容！
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/games"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-gradient-theme px-6 text-sm font-bold text-white shadow-glow transition-opacity duration-200 ease-out hover:opacity-90"
              >
                <Gamepad2 className="h-4 w-4" strokeWidth={1.8} />
                进入游戏库
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-border-strong bg-surface px-6 text-sm font-bold text-text-secondary transition-colors duration-200 ease-out hover:border-accent hover:text-accent-hover"
              >
                关于我
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
