"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tags } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { ArticleCard } from "@/components/ArticleCard";
import { SocialIcons } from "@/components/SocialIcons";
import {
  CatFace,
  ChibiCat,
  PawPrint,
  Sparkle,
  SunsetScene,
} from "@/components/ComicDoodle";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getPortfolios } from "@/lib/api/portfolios";
import { getTags } from "@/lib/api/tags";
import { getModuleConfig } from "@/lib/api/module-config";
import { formatShortDate } from "@/lib/format";
import type { ModuleConfig } from "@/lib/types";
import type { Article, Portfolio, Tag } from "@/lib/types";

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

/** 区块标题：黄底猫头 + 手绘风标题 + 查看更多 */
function SectionHeader({
  title,
  moreHref,
  moreLabel = "查看更多",
}: {
  title: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="flex items-center gap-2.5 font-display text-xl text-text-primary sm:text-2xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-accent">
          <CatFace className="h-5 w-5 text-ink" />
        </span>
        {title}
      </h2>
      {moreHref && (
        <Link
          href={moreHref}
          className="group flex cursor-pointer items-center gap-1 text-sm text-text-muted transition-colors duration-200 hover:text-accent-hover"
        >
          {moreLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={1.5}
          />
        </Link>
      )}
    </div>
  );
}

/** 作品卡（首页预览）：封面 + 名称 + 分类 + 数量 */
function PortfolioPreviewCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Link
      href="/portfolio"
      className="group block cursor-pointer"
      aria-label={`查看作品 ${portfolio.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-radius-md border border-border bg-background-soft shadow-card transition-shadow duration-300 ease-out group-hover:shadow-card-hover">
        {portfolio.cover_url ? (
          <Image
            src={portfolio.cover_url}
            alt={portfolio.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CatFace className="h-10 w-10 text-text-subtle" />
          </div>
        )}
        {portfolio.category_name && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-ink/85 px-2 py-0.5 text-[11px] text-accent backdrop-blur-sm">
            {portfolio.category_name}
          </span>
        )}
      </div>
      <h3 className="mt-2.5 truncate text-center font-display text-base text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
        《{portfolio.name}》
      </h3>
      <p className="mt-0.5 text-center text-xs text-text-muted">
        {portfolio.item_count} 张 · {portfolio.category_name || "漫画"}
      </p>
    </Link>
  );
}

export function HomeContent() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [moduleConfig, setModuleConfig] = useState<ModuleConfig>(ALL_ENABLED);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, po, a, t, m] = await Promise.all([
        getBloggerProfile(),
        getPortfolios({ page: 1, page_size: 4 }),
        getArticles({ page: 1, page_size: 3 }),
        getTags(),
        getModuleConfig(),
      ]);
      setProfile(p);
      setPortfolios(po.list);
      setArticles(a.list);
      setTags(t.slice(0, 10));
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const bioLines = (profile?.bio || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection profile={profile} />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 sm:px-6 lg:px-8">
        {/* 第一行：最新作品 + 关于我 */}
        <section className="grid grid-cols-1 gap-6 py-10 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            {!loading && moduleConfig.portfolio_enabled && portfolios.length > 0 && (
              <>
                <SectionHeader title="最新作品" moreHref="/portfolio" />
                <div className="grid grid-cols-2 gap-5 sm:gap-6 xl:grid-cols-4">
                  {portfolios.map((portfolio) => (
                    <PortfolioPreviewCard key={portfolio.id} portfolio={portfolio} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 关于我卡片 */}
          <aside className="rounded-radius-lg border border-border bg-surface-highlight p-6 shadow-card sm:p-7">
            <h2 className="flex items-center gap-2.5 font-display text-xl text-text-primary">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-accent">
                <CatFace className="h-5 w-5 text-ink" />
              </span>
              关于我
            </h2>

            <div className="relative mt-5">
              <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
                {(bioLines.length > 0
                  ? bioLines
                  : ["这里是小町的漫画角，", "记录每一格涂鸦与心情。"]
                ).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              {/* 手写签名（右侧留出贴纸位置） */}
              <div className="mt-5 pr-16 text-right sm:pr-20">
                <p className="font-hand text-xl leading-tight text-text-secondary">
                  谢谢你，愿意来看我的世界！
                </p>
                <p className="mt-1 font-hand text-lg text-text-muted">
                  — {profile?.nickname || "墨染小町"}
                </p>
              </div>

              <ChibiCat className="pointer-events-none absolute -bottom-7 -right-1 h-24 w-24 animate-doodle-float" />
            </div>

            {profile?.social_links && profile.social_links.length > 0 && (
              <div className="mt-12 border-t border-dashed border-border-strong pt-4">
                <SocialIcons links={profile.social_links} />
              </div>
            )}
          </aside>
        </section>

        {/* 第二行：最新动态 + 热门标签 */}
        <section className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-3 lg:gap-8">
          {/* 最新动态时间线 */}
          <div className="rounded-radius-lg border border-border bg-surface p-6 shadow-card sm:p-7 lg:col-span-2">
            {!loading && moduleConfig.article_enabled && (
              <>
                <SectionHeader title="最新动态" moreHref="/articles" />
                {articles.length > 0 ? (
                  <ol className="space-y-5">
                    {articles.map((article) => (
                      <li key={article.id} className="flex items-start gap-4">
                        <div className="flex w-12 shrink-0 flex-col items-center pt-0.5">
                          <span className="font-display text-lg leading-none text-text-primary">
                            {formatShortDate(article.published_at || article.created_at)}
                          </span>
                          <span className="mt-1.5 h-3 w-px bg-border-strong" aria-hidden="true" />
                        </div>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="group flex min-w-0 flex-1 items-start gap-3.5"
                        >
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-radius-sm border border-border bg-background-soft">
                            {article.cover_image ? (
                              <Image
                                src={article.cover_image}
                                alt={article.title}
                                fill
                                sizes="80px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <CatFace className="h-5 w-5 text-text-subtle" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
                              {article.title}
                            </p>
                            <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-text-muted">
                              {article.summary}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="py-8 text-center text-sm text-text-muted">
                    还没有发布动态，敬请期待～
                  </p>
                )}
              </>
            )}
          </div>

          {/* 热门标签 */}
          <div className="rounded-radius-lg border border-border bg-surface p-6 shadow-card sm:p-7">
            <h2 className="flex items-center gap-2.5 font-display text-xl text-text-primary">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-accent">
                <Tags className="h-4.5 w-4.5 text-ink" strokeWidth={1.8} />
              </span>
              热门标签
            </h2>

            {!loading && moduleConfig.article_enabled && (
              <>
                {tags.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/articles?keyword=${encodeURIComponent(tag.name)}`}
                        className="cursor-pointer rounded-full border border-border-strong bg-background px-3.5 py-1.5 text-xs text-text-secondary transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-text-muted">暂无标签</p>
                )}

                {/* 手写涂鸦 */}
                <div className="mt-8 flex items-end justify-between">
                  <CatFace className="h-12 w-12 -rotate-6 text-ink" />
                  <div className="text-right">
                    <p className="font-hand text-xl leading-tight text-text-secondary">
                      喜欢漫画
                    </p>
                    <p className="font-hand text-xl leading-tight text-text-secondary">
                      也喜欢你们！
                    </p>
                  </div>
                  <PawPrint className="h-6 w-6 rotate-12 text-accent-hover" />
                </div>
              </>
            )}
          </div>
        </section>

        {/* 告别横幅：下一页，我们在漫画里再见 */}
        <Link
          href="/portfolio"
          className="group relative mt-8 block overflow-hidden rounded-radius-lg border border-ink shadow-card transition-shadow duration-300 ease-out hover:shadow-card-hover"
          aria-label="去看下一页作品"
        >
          <div className="relative h-56 sm:h-64">
            <SunsetScene className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
              <p className="font-display text-2xl text-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.55)] sm:text-3xl">
                下一页，我们在漫画里
              </p>
              <p className="font-display text-3xl text-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.55)] sm:text-4xl">
                再见！
                <span className="ml-1 inline-block align-middle text-2xl">:)</span>
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs text-accent transition-transform duration-200 group-hover:scale-105">
                <Sparkle className="h-3 w-3" />
                去看下一页作品
                <ArrowRight className="h-3 w-3" strokeWidth={2} />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
