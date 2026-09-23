"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Globe,
  MapPin,
  Newspaper,
  Play,
  Settings,
  UserRound,
  Wrench,
} from "lucide-react";
import {
  blogger,
  videos,
  articles,
  equipments,
  moduleConfig,
  ALL_ENABLED,
  type Article,
  type Blogger,
  type Equipment,
  type ModuleConfig,
  type PaginatedResponse,
  type Video,
} from "@/lib/api";
import { SectionHeader } from "@/components/section-header";
import { VideoCard } from "@/components/video-card";

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * 首页内容：静态导出后构建期取数会被固化，因此首页内容全部客户端取数，
 * 保证制品在任何后端环境下部署都能实时展示（参考 lens-life-template 模式）。
 */
export function HomeContent() {
  const [info, setInfo] = useState<Blogger | null>(null);
  const [modules, setModules] = useState<ModuleConfig>(ALL_ENABLED);
  const [videoRes, setVideoRes] = useState<PaginatedResponse<Video> | null>(null);
  const [articleRes, setArticleRes] = useState<PaginatedResponse<Article> | null>(null);
  const [equipmentRes, setEquipmentRes] = useState<PaginatedResponse<Equipment> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      blogger.get().catch(() => null),
      moduleConfig.get().catch(() => ALL_ENABLED),
      videos.list({ page_size: 4 }).catch(() => ({ list: [], total: 0 })),
      articles.list({ page_size: 4 }).catch(() => ({ list: [], total: 0 })),
      equipments.list({ page_size: 4 }).catch(() => ({ list: [], total: 0 })),
    ]).then(([b, m, v, a, e]) => {
      if (cancelled) return;
      setInfo(b);
      setModules(m);
      setVideoRes(v as PaginatedResponse<Video>);
      setArticleRes(a as PaginatedResponse<Article>);
      setEquipmentRes(e as PaginatedResponse<Equipment>);
      // 动态设置 favicon 与标题，弥补静态导出下构建期后端不可达的情况
      if (b?.blog_icon) {
        let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = b.blog_icon;
      }
      if (b?.blog_title && !document.title.includes(b.blog_title)) {
        document.title = b.blog_title;
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredVideos = videoRes?.list ?? [];
  const latestArticles = articleRes?.list ?? [];
  const gearList = equipmentRes?.list ?? [];

  // 三栏底区：关于我固定，博客/装备列按模块开关与数据有无渲染
  const columns: ("about" | "articles" | "gear")[] = [
    "about",
    ...(modules.article_enabled && latestArticles.length > 0 ? (["articles"] as const) : []),
    ...(modules.equipment_enabled ? (["gear"] as const) : []),
  ];
  const columnGrid =
    columns.length === 3 ? "lg:grid-cols-3" : columns.length === 2 ? "md:grid-cols-2" : "";

  const primaryCta = modules.video_enabled
    ? { href: "/videos", label: "查看我的作品" }
    : modules.article_enabled
      ? { href: "/articles", label: "阅读我的博客" }
      : { href: "/about", label: "了解更多" };

  return (
    <div className="min-h-screen">
      {/* Hero：左侧手写标题 + 右侧大图 */}
      <section className="relative overflow-hidden">
        <div className="glow-orb -right-24 -top-24 h-96 w-96 bg-primary/20" aria-hidden />
        <div className="glow-orb bottom-0 left-1/4 h-64 w-64 bg-accent/10" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-14">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-hand leading-snug text-foreground">
                <span className="block text-4xl sm:text-5xl">用视频</span>
                <span className="block text-4xl sm:text-5xl">
                  记录生活的
                  <Camera
                    className="ml-2 inline h-9 w-9 -rotate-12 text-accent sm:h-11 sm:w-11"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                </span>
                <span className="doodle-underline mt-2 inline-block text-5xl text-primary sm:text-6xl">
                  更多可能
                </span>
              </h1>
              <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0">
                {info?.bio ||
                  info?.blog_description ||
                  "我是一个热爱影像创作的博主，分享视频拍摄技巧、拍摄 Vlog、设备评测和创意剪辑，希望能用镜头，记录生活中那些闪闪发光的瞬间。"}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  href={primaryCta.href}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {primaryCta.label}
                </Link>
                <Link
                  href="/about"
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <UserRound className="h-4 w-4" />
                  了解更多
                </Link>
              </div>
            </div>

            <div className="w-full max-w-xl flex-1">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/40">
                {info?.page_background ? (
                  <Image
                    src={info.page_background}
                    alt={info.blog_title || "创作工作台"}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                ) : info ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-secondary via-card to-background">
                    <Camera className="h-16 w-16 text-primary" strokeWidth={1.2} aria-hidden />
                    <p className="font-hand text-2xl text-muted-foreground">用镜头，记录热爱的世界</p>
                  </div>
                ) : (
                  <div className="h-full w-full animate-pulse bg-muted" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 精选作品 */}
      {modules.video_enabled && featuredVideos.length > 0 && (
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              icon={<Clapperboard className="h-5 w-5" />}
              title="精选作品"
              subtitle="一些我最近喜欢的视频，欢迎观看与交流～"
              moreHref="/videos"
              moreLabel="查看全部作品"
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredVideos.map((video, i) => (
                <VideoCard key={video.id} video={video} priority={i < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 加载骨架：三栏区 */}
      {loading && (
        <section className="border-y border-border bg-card/40 py-14 lg:py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-0 lg:px-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`animate-pulse ${i > 0 ? "lg:pl-10" : "lg:pr-10"}`}>
                <div className="h-8 w-28 rounded-lg bg-muted" />
                <div className="mt-6 h-40 rounded-2xl bg-muted" />
                <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 关于我 / 最新动态 / 我的装备 */}
      {!loading && columns.length > 0 && (
        <section className="border-y border-border bg-card/40 py-14 lg:py-20">
          <div
            className={`mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 ${columnGrid} lg:gap-0 lg:px-8`}
          >
            {/* 关于我 */}
            <div className="lg:pr-10">
              <SectionHeader icon={<UserRound className="h-5 w-5" />} title="关于我" />
              <div className="mt-6 flex flex-col gap-5 sm:flex-row lg:flex-col xl:flex-row">
                <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-44 sm:w-36 xl:w-40">
                  {info?.avatar ? (
                    <Image
                      src={info.avatar}
                      alt={info.nickname || "博主头像"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <UserRound className="h-12 w-12 text-muted-foreground/60" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-hand text-2xl text-foreground">
                    你好，我是{info?.nickname || "创作者"}
                    <span aria-hidden> 👋</span>
                  </p>
                  <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-muted-foreground">
                    {info?.bio || info?.blog_description || "热爱影像创作，用镜头记录生活。"}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Clapperboard className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>
                        {info?.tags?.length
                          ? info.tags.slice(0, 2).join(" · ")
                          : "视频博主 · 影像创作者"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>
                        {(info?.social_links?.length ?? 0) > 0
                          ? info!.social_links
                              .slice(0, 3)
                              .map((l) => l.name || l.platform)
                              .join(" · ") + " 同步更新"
                          : "各平台同步更新"}
                      </span>
                    </li>
                    {info?.city && (
                      <li className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span>坐标：{info.city}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <p className="doodle-underline mt-6 inline-block font-hand text-xl text-accent lg:-rotate-2">
                一起把生活拍成电影！
              </p>
            </div>

            {/* 最新动态 */}
            {columns.includes("articles") && (
              <div className="lg:px-10">
                <SectionHeader
                  icon={<Newspaper className="h-5 w-5" />}
                  title="最新动态"
                  moreHref="/articles"
                  moreLabel="查看更多"
                />
                <ul className="mt-6 space-y-5">
                  {latestArticles.map((article: Article) => (
                    <li key={article.id}>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="group flex cursor-pointer items-center gap-4 rounded-xl focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border border-border">
                          {article.cover_image ? (
                            <Image
                              src={article.cover_image}
                              alt={article.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                              <Newspaper className="h-5 w-5 text-muted-foreground/60" aria-hidden />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(article.published_at || article.created_at)}
                          </p>
                          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                            {article.title}
                          </h3>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 我的装备 */}
            {columns.includes("gear") && (
              <div className="lg:pl-10">
                <SectionHeader
                  icon={<Settings className="h-5 w-5" />}
                  title="我的装备"
                  moreHref="/gear"
                  moreLabel="看看我常用的设备"
                />
                <div className="relative mt-6">
                  <div className="grid grid-cols-2 gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3">
                    {gearList.length > 0 ? (
                      gearList.slice(0, 4).map((item: Equipment) => (
                        <div
                          key={item.id}
                          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
                        >
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Wrench className="h-6 w-6 text-muted-foreground/50" aria-hidden />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex aspect-[2/1] flex-col items-center justify-center gap-2 rounded-xl bg-muted">
                        <Wrench className="h-8 w-8 text-muted-foreground/50" aria-hidden />
                        <p className="font-hand text-lg text-muted-foreground">
                          好设备，让创意更自由
                        </p>
                      </div>
                    )}
                  </div>
                  {gearList.length > 0 && (
                    <p className="absolute -bottom-3 right-4 -rotate-3 rounded bg-card/90 px-2 font-hand text-lg text-accent">
                      好设备，让创意更自由 <span aria-hidden>✨</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
