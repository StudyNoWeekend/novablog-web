"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { BloggerCard } from "@/components/BloggerCard";
import { CategoryTiles } from "@/components/CategoryTiles";
import { CtaBanner } from "@/components/CtaBanner";
import { HeroSection } from "@/components/HeroSection";
import { HotArticles } from "@/components/HotArticles";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles, getHotArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/categories";
import { getModuleConfig } from "@/lib/api/module-config";
import type { ModuleConfig, Article, Category } from "@/lib/types";

interface HomeData {
  profile: BloggerProfile | null;
  articles: Article[];
  hotArticles: Article[];
  categories: Category[];
  modules: ModuleConfig;
}

type HomeState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; data: HomeData };

export function HomeContent() {
  const [state, setState] = useState<HomeState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, a, hot, cats, m] = await Promise.all([
          getBloggerProfile(),
          getArticles({ page: 1, page_size: 6 }),
          getHotArticles(5),
          getCategories(),
          getModuleConfig(),
        ]);
        if (cancelled) return;
        setState({
          status: "ok",
          data: {
            profile: p,
            articles: a.list,
            hotArticles: hot,
            categories: cats,
            modules: m,
          },
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
        if (p?.blog_title) {
          document.title = p.blog_title;
        }
      } catch (err) {
        if (cancelled) return;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "加载首页失败",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (state.status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24">
        <p className="mb-4 text-text-muted">{state.message}</p>
        <button
          type="button"
          onClick={() => {
            setState({ status: "loading" });
            setReloadKey((k) => k + 1);
          }}
          className="cursor-pointer rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          重试
        </button>
      </div>
    );
  }

  const loading = state.status === "loading";
  const profile = state.status === "ok" ? state.data.profile : null;
  const articles = state.status === "ok" ? state.data.articles : [];
  const hotArticles = state.status === "ok" ? state.data.hotArticles : [];
  const categories = state.status === "ok" ? state.data.categories : [];
  const modules: ModuleConfig =
    state.status === "ok"
      ? state.data.modules
      : {
          article_enabled: true,
          media_enabled: true,
          music_enabled: true,
          video_enabled: true,
          travel_enabled: true,
          portfolio_enabled: true,
          equipment_enabled: true,
          updated_at: "",
        };

  const authorName = profile?.nickname || "";
  const authorAvatar = profile?.avatar || "";

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <HeroSection profile={profile} />

      {/* Category tiles */}
      {!loading && (modules.article_enabled || modules.travel_enabled) && (
        <CategoryTiles
          categories={modules.article_enabled ? categories : []}
          travelEnabled={modules.travel_enabled}
        />
      )}

      {/* Latest articles + sidebar */}
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            {/* Main column */}
            <div className="lg:col-span-2">
              <div className="mb-8 flex items-end justify-between">
                <h2 className="flex items-center gap-2.5 font-display text-2xl text-text-primary md:text-3xl">
                  <span className="h-6 w-1.5 rounded-full bg-accent" />
                  最新游记
                  <span className="font-hand text-xl font-medium text-accent/70 md:text-2xl">
                    New~
                  </span>
                </h2>
                {modules.article_enabled && (
                  <Link
                    href="/articles"
                    className="group flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 hover:text-accent"
                  >
                    查看更多
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      strokeWidth={1.8}
                    />
                  </Link>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] animate-pulse rounded-radius-lg bg-background-soft"
                    />
                  ))}
                </div>
              ) : modules.article_enabled && articles.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      authorName={authorName}
                      authorAvatar={authorAvatar}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-radius-lg border border-dashed border-border bg-surface py-16 text-center text-sm text-text-muted">
                  {modules.article_enabled
                    ? "暂无游记，快去写下第一篇吧～"
                    : "游记模块暂未开启"}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
              <BloggerCard profile={profile} />
              {!loading && modules.article_enabled && (
                <HotArticles articles={hotArticles} />
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <CtaBanner />
    </div>
  );
}
