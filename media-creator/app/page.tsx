import Link from "next/link";
import Image from "next/image";
import { PlaySquare, FileText, ExternalLink, ChevronRight, Globe } from "lucide-react";
import { blogger, videos, articles } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Creator Blog - 视频创作者主页",
  description: "精选视频作品、最新文章动态与社交平台入口。",
};

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function HomePage() {
  const [info, videoRes, articleRes] = await Promise.all([
    blogger.get().catch(() => null),
    videos.list({ page_size: 6 }).catch(() => ({ list: [], total: 0 })),
    articles.list({ page_size: 6 }).catch(() => ({ list: [], total: 0 })),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary blur-3xl" />
          <div className="absolute -left-20 top-40 h-80 w-80 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
                <PlaySquare className="h-4 w-4" />
                视频创作者 / 内容博主
              </div>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                欢迎来到{" "}
                <span className="text-gradient-creator">{info?.blog_title || "Media Creator"}</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                {info?.blog_description || "分享视频作品、文章动态与创作生活"}
              </p>
              <p className="mt-3 text-base text-muted-foreground">{info?.bio}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  href="/videos"
                  className="inline-flex items-center gap-2 rounded-full gradient-creator px-6 py-3 text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <PlaySquare className="h-4 w-4" />
                  观看视频
                </Link>
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <FileText className="h-4 w-4" />
                  阅读文章
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 sm:h-48 sm:w-48">
                {info?.avatar ? (
                  <Image
                    src={info.avatar}
                    alt={info.nickname || "博主头像"}
                    fill
                    className="rounded-full border-4 border-white object-cover shadow-2xl shadow-primary/20"
                    unoptimized
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white gradient-creator text-5xl font-bold shadow-2xl shadow-primary/20">
                    {info?.nickname?.[0] || "M"}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                  <PlaySquare className="h-4 w-4" />
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">{info?.nickname || "Media Creator"}</h2>
              <p className="text-sm text-muted-foreground">@{info?.nickname || "creator"}</p>

              {info?.social_links && info.social_links.length > 0 && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {info.social_links.map((link) => (
                    <a
                      key={link.platform + link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Globe className="h-4 w-4" />
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="bg-background py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">精选视频</h2>
            <Link
              href="/videos"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              全部视频 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {videoRes.list.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-card p-10 text-center text-muted-foreground border border-border">
              暂无视频作品
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videoRes.list.map((video) => (
                <div
                  key={video.id}
                  className="group overflow-hidden rounded-2xl bg-card shadow-sm border border-border transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {video.cover_url ? (
                      <Image
                        src={video.cover_url}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <PlaySquare className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                      <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100">
                        <PlaySquare className="h-5 w-5 fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-1 text-base font-semibold text-foreground">{video.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {video.platforms?.slice(0, 3).map((platform) => (
                        <a
                          key={platform.id}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {platform.platform}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Articles */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">最新文章</h2>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              全部文章 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {articleRes.list.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-card p-10 text-center text-muted-foreground border border-border">
              暂无文章动态
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articleRes.list.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm border border-border transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {article.cover_image ? (
                      <Image
                        src={article.cover_image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {article.category_name && (
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          {article.category_name}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(article.published_at)}</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.summary}</p>
                    <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-muted-foreground">
                      <span>{article.view_count} 阅读</span>
                      <span>{article.comment_count} 评论</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
