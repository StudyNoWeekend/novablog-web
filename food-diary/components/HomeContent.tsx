"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChefHat } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { CategoryNav } from "@/components/CategoryNav";
import { ArticleCard } from "@/components/ArticleCard";
import { AboutCard } from "@/components/AboutCard";
import { TravelBanner } from "@/components/TravelBanner";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/categories";
import { getTravels } from "@/lib/api/travels";
import { getModuleConfig } from "@/lib/api/module-config";
import type { ModuleConfig, Article, Category, TravelGuide } from "@/lib/types";

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

/** 首页：Hero + 热门分类 + 最新美食日记（含关于我侧栏） + 旅行横幅（对应 UI 图整页布局） */
export function HomeContent() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [travels, setTravels] = useState<TravelGuide[]>([]);
  const [moduleConfig, setModuleConfig] = useState<ModuleConfig>(ALL_ENABLED);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, a, c, t, m] = await Promise.all([
        getBloggerProfile(),
        getArticles({ page: 1, page_size: 4 }),
        getCategories(),
        getTravels({ page: 1, page_size: 3 }),
        getModuleConfig(),
      ]);
      setProfile(p);
      setArticles(a.list);
      setCategories(c);
      setTravels(t.list);
      setModuleConfig(m);

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
          className="cursor-pointer rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          重试
        </button>
      </div>
    );
  }

  const covers = articles
    .filter((a) => a.cover_image)
    .slice(0, 2)
    .map((a) => ({ url: a.cover_image, title: a.title }));

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <HeroSection profile={profile} covers={covers} />

      {/* 热门分类 */}
      <CategoryNav
        categories={categories}
        travelEnabled={moduleConfig.travel_enabled}
      />

      {/* 最新美食日记 */}
      <section className="bg-background py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-card">
                <ChefHat className="h-5.5 w-5.5" strokeWidth={1.6} />
              </span>
              <div>
                <h2 className="font-display text-2xl text-text-primary md:text-3xl">
                  最新美食日记
                </h2>
                <p className="mt-0.5 text-xs text-text-muted md:text-sm">
                  记录每一餐的灵感与快乐
                </p>
              </div>
            </div>
            {moduleConfig.article_enabled && (
              <Link
                href="/articles"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 ease-out hover:text-accent-hover"
              >
                查看更多
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            )}
          </div>

          {/* Cards + About sidebar */}
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">
              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3.4] animate-pulse rounded-lg bg-background-soft"
                    />
                  ))}
                </div>
              ) : moduleConfig.article_enabled && articles.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border-strong text-text-muted">
                  <p className="font-hand text-2xl text-text-subtle">still cooking…</p>
                  <p className="mt-1 text-sm">美食日记正在准备中，敬请期待</p>
                </div>
              )}
            </div>

            <AboutCard profile={profile} loading={loading} />
          </div>
        </div>
      </section>

      {/* 旅行横幅 */}
      {!loading && moduleConfig.travel_enabled && travels.length > 0 && (
        <TravelBanner travels={travels} />
      )}
    </div>
  );
}
