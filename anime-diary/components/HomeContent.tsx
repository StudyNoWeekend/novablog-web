"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cat,
  Gamepad2,
  Heart,
  Palette,
  Sparkles,
  Star,
  Tv,
  Tags as TagsIcon,
  type LucideIcon,
} from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { SocialIcon } from "@/components/SocialIcon";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/categories";
import { getTags } from "@/lib/api/tags";
import type { Article, Category, Tag } from "@/lib/types";

const HERO_TAGS = ["动漫", "游戏", "插画", "生活", "分享"];

/** 分类入口卡的图标与马卡龙配色（按顺序循环） */
const CATEGORY_STYLES: { icon: LucideIcon; color: string; bg: string }[] = [
  { icon: Tv, color: "text-sky", bg: "bg-sky-subtle" },
  { icon: Gamepad2, color: "text-lav-hover", bg: "bg-lav-subtle" },
  { icon: Palette, color: "text-accent-hover", bg: "bg-accent-subtle" },
  { icon: Heart, color: "text-mint", bg: "bg-mint-subtle" },
  { icon: Cat, color: "text-sky", bg: "bg-sky-subtle" },
  { icon: TagsIcon, color: "text-lav-hover", bg: "bg-lav-subtle" },
];

const TAG_CHIP_STYLES = [
  "border-accent/30 bg-accent-subtle text-accent-hover",
  "border-lav/30 bg-lav-subtle text-lav-hover",
  "border-sky/30 bg-sky-subtle text-sky",
  "border-mint/30 bg-mint-subtle text-mint",
];

function tagChipStyle(name: string): string {
  let sum = 0;
  for (const ch of name) sum += ch.codePointAt(0) ?? 0;
  return TAG_CHIP_STYLES[sum % TAG_CHIP_STYLES.length];
}

export function HomeContent() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [p, a, c, t] = await Promise.all([
      getBloggerProfile(),
      getArticles({ page: 1, page_size: 4 }),
      getCategories(),
      getTags(),
    ]);
    setProfile(p);
    setArticles(a.list);
    setCategories(c.filter((cat) => cat.type === "article").slice(0, 4));
    setTags(t.slice(0, 10));
    setLoading(false);

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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const bioLines = (profile?.bio || "").split("\n").filter(Boolean);

  return (
    <div className="flex flex-1 flex-col">
      {/* ==================== Hero ==================== */}
      <section className="relative overflow-hidden bg-night">
        {/* 背景图（博主设置的页面背景）+ 深紫渐变遮罩 */}
        {profile?.page_background ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={profile.page_background}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(155,140,242,0.35),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(240,120,161,0.28),transparent_50%)]" />
        )}

        {/* 漂浮星星装饰 */}
        <Star
          aria-hidden="true"
          className="absolute left-[8%] top-[22%] h-5 w-5 animate-twinkle fill-accent/70 text-accent/70"
        />
        <Sparkles
          aria-hidden="true"
          className="absolute left-[38%] top-[16%] h-6 w-6 animate-floaty text-lav/80"
        />
        <Star
          aria-hidden="true"
          className="absolute bottom-[24%] left-[28%] h-4 w-4 animate-twinkle fill-white/50 text-white/50 [animation-delay:1s]"
        />
        <Heart
          aria-hidden="true"
          className="absolute right-[10%] top-[26%] h-5 w-5 animate-floaty fill-accent/60 text-accent/60 [animation-delay:0.6s]"
        />
        <Sparkles
          aria-hidden="true"
          className="absolute bottom-[30%] right-[24%] h-5 w-5 animate-twinkle fill-lav/60 text-lav/60 [animation-delay:1.6s]"
        />

        <div className="relative mx-auto flex min-h-[440px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 md:min-h-[520px] lg:px-8">
          <p className="mb-4 flex items-center gap-2 text-sm tracking-[0.3em] text-accent">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
            WELCOME TO MY WORLD
          </p>
          <h1 className="max-w-2xl font-heading text-4xl leading-snug text-white md:text-5xl md:leading-snug">
            {profile?.blog_description || "用二次元，记录生活的美好"}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/80">
            {HERO_TAGS.map((tag, i) => (
              <span key={tag} className="flex items-center gap-3">
                {i > 0 && <span className="text-accent/60">·</span>}
                <span>{tag}</span>
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/articles"
              className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-7 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-all duration-200 ease-out hover:bg-accent-hover"
            >
              探索我的世界
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-white/25 px-7 text-sm text-white/85 transition-colors duration-200 ease-out hover:border-accent hover:text-accent"
            >
              关于我
            </Link>
          </div>
        </div>

        {/* 底部波浪过渡到内容区 */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          className="relative block h-10 w-full fill-background sm:h-14"
        >
          <path d="M0,32 C240,64 480,0 720,24 C960,48 1200,16 1440,40 L1440,64 L0,64 Z" />
        </svg>
      </section>

      {/* ==================== 博主介绍 + 分类入口 ==================== */}
      <section className="bg-background py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:gap-10 lg:px-8">
          {/* 博主卡片 */}
          <div className="flex flex-col items-center rounded-radius-lg border border-border bg-surface p-8 text-center shadow-card sm:flex-row sm:items-start sm:text-left lg:col-span-2">
            <div className="relative shrink-0">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-accent/30 bg-background-soft">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.nickname}
                    fill
                    sizes="112px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Cat className="h-10 w-10 text-text-subtle" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <Heart
                aria-hidden="true"
                className="absolute -right-1 -top-1 h-6 w-6 animate-floaty fill-accent text-accent"
                strokeWidth={1.5}
              />
            </div>
            <div className="mt-5 min-w-0 sm:ml-6 sm:mt-0">
              <h2 className="font-heading text-2xl text-text-primary">
                {profile?.nickname || "二次元博主"}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {profile?.blog_title || ""}
              </p>
              <div className="mt-3 space-y-1 text-sm leading-relaxed text-text-secondary">
                {bioLines.length > 0 ? (
                  bioLines.map((line, i) => <p key={i}>{line}</p>)
                ) : (
                  <p>欢迎来到我的小站，一起发现更多有趣的东西！</p>
                )}
              </div>
              {profile?.tags && profile.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border px-3 py-1 text-xs ${tagChipStyle(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 分类入口（取文章分类前 4 个） */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-radius-lg bg-surface shadow-card"
                  />
                ))
              : categories.map((category, i) => {
                  const style = CATEGORY_STYLES[i % CATEGORY_STYLES.length];
                  const Icon = style.icon;
                  return (
                    <Link
                      key={category.id}
                      href={`/articles?category_id=${encodeURIComponent(category.id)}`}
                      className="group flex cursor-pointer flex-col justify-center rounded-radius-lg border border-border bg-surface p-6 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${style.bg}`}
                      >
                        <Icon
                          className={`h-6 w-6 transition-transform duration-200 group-hover:scale-110 ${style.color}`}
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3 className="mt-3 font-heading text-lg text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-1 line-clamp-1 text-xs text-text-muted">
                          {category.description}
                        </p>
                      )}
                    </Link>
                  );
                })}
          </div>
        </div>
      </section>

      {/* ==================== 最新动态 + 侧栏 ==================== */}
      <section className="bg-background-soft py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:px-8">
          {/* 最新动态 */}
          <div>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="flex items-center gap-2.5 font-heading text-2xl text-text-primary md:text-3xl">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-subtle">
                    <Cat className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  </span>
                  最新动态
                  <span className="hidden text-sm font-normal tracking-widest text-text-subtle sm:inline">
                    Latest Posts
                  </span>
                </h2>
              </div>
              <Link
                href="/articles"
                className="group flex cursor-pointer items-center gap-1 text-sm text-text-muted transition-colors duration-200 hover:text-accent-hover"
              >
                查看更多
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[16/13] animate-pulse rounded-radius-md bg-surface"
                  />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="rounded-radius-md border border-dashed border-border bg-surface py-16 text-center">
                <p className="font-heading text-text-muted">
                  还没有发布动态，敬请期待～
                </p>
              </div>
            )}
          </div>

          {/* 侧栏 */}
          <aside className="space-y-6 lg:self-start">
            {/* 博主小卡 */}
            <div className="rounded-radius-lg border border-accent/20 bg-surface p-6 text-center shadow-card">
            <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full border-2 border-accent/40 bg-background-soft">
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.nickname || ""}
                  fill
                  sizes="64px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : null}
            </div>
              <p className="mt-3 font-heading text-lg text-text-primary">
                欢迎来到我的小站
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                {profile?.blog_description || "一起把喜欢的东西，变成更有意义的生活吧"}
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-accent text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
              >
                <Heart className="h-4 w-4 fill-current" strokeWidth={1.5} />
                关注我
              </Link>
              {profile?.social_links && profile.social_links.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {profile.social_links.slice(0, 6).map((link) => (
                    <SocialIcon
                      key={`${link.platform}-${link.url}`}
                      platform={link.name || link.platform}
                      url={link.url}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 热门标签 */}
            {tags.length > 0 && (
              <div className="rounded-radius-lg border border-border bg-surface p-6 shadow-card">
                <h3 className="mb-4 flex items-center gap-2 font-heading text-base text-text-primary">
                  <TagsIcon className="h-4 w-4 text-lav-hover" strokeWidth={1.5} />
                  热门标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/articles?keyword=${encodeURIComponent(tag.name)}`}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-all duration-200 hover:-translate-y-0.5 ${tagChipStyle(tag.name)}`}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 关注横幅 */}
            <Link
              href="/contact"
              className="group relative block overflow-hidden rounded-radius-lg bg-gradient-to-br from-accent via-accent-hover to-lav-hover p-6 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover"
            >
              <Heart
                aria-hidden="true"
                className="absolute -right-3 -top-3 h-16 w-16 fill-white/15 text-transparent"
                strokeWidth={1.5}
              />
              <p className="font-heading text-lg leading-relaxed text-white">
                喜欢就关注我吧
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/85">
                一起去发现更多有趣的世界
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors duration-200 group-hover:bg-white/30">
                查看联系方式
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </span>
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
