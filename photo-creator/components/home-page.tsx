"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ChevronDown, ChevronRight, ImageIcon } from "lucide-react";
import { blogger, articles, portfolios, Blogger, Article, Portfolio } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SocialLinks } from "./social-links";
import { ErrorState, EmptyState } from "./error-state";
import { HeroSkeleton, PortfolioWallSkeleton, JournalSkeleton, AboutSkeleton } from "./loading";
import { ScrollReveal, LineReveal } from "./scroll-reveal";

export function HomePage() {
  const [bloggerData, setBloggerData] = useState<Blogger | null>(null);
  const [portfoliosData, setPortfoliosData] = useState<Portfolio[]>([]);
  const [articlesData, setArticlesData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const wallRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, p, a] = await Promise.all([
        blogger.get().catch(() => null),
        portfolios.list({ page: 1, page_size: 6 }),
        articles.list({ page: 1, page_size: 4 }),
      ]);
      setBloggerData(b);
      setPortfoliosData(p.list);
      setArticlesData(a.list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载首页失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!wallRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - wallRef.current.offsetLeft);
    setScrollLeft(wallRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !wallRef.current) return;
    e.preventDefault();
    const x = e.pageX - wallRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    wallRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-0">
        <HeroSkeleton />
        <AboutSkeleton />
        <PortfolioWallSkeleton />
        <JournalSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  const title = bloggerData?.blog_title ?? "摄影作品集";
  const nickname = bloggerData?.nickname?.trim();
  const initial = (nickname || title || "摄").charAt(0).toUpperCase();
  const titleFirst = nickname || title;
  const titleSecond =
    nickname && bloggerData?.blog_title && bloggerData.blog_title !== nickname
      ? bloggerData.blog_title
      : "摄影日志";

  const rawStatement = (bloggerData?.blog_description?.trim() || bloggerData?.bio?.trim() || "");
  const statementLines =
    rawStatement.length > 0 && rawStatement.length <= 36
      ? rawStatement.split("\n")
      : ["记录那些", "即将消失的瞬间"];

  const email =
    bloggerData?.social_links?.find((link) =>
      ["mail", "email"].includes(link.platform.toLowerCase())
    )?.url?.replace(/^mailto:/i, "") || "";

  const quoteBg = portfoliosData[0]?.cover_url || bloggerData?.page_background || "";

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen w-full">
        {bloggerData?.page_background ? (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={bloggerData.page_background}
              alt=""
              fill
              unoptimized
              priority
              className="animate-hero-zoom object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-background" />
        )}

        <div className="relative z-10 flex min-h-screen flex-col px-4 pb-10 pt-24 sm:px-6 lg:px-8">
          {/* Top magazine logo */}
          <div className="mx-auto flex w-full max-w-7xl items-start justify-between">
            <Link
              href="/"
              className="group flex cursor-pointer items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="font-heading text-4xl font-light leading-none text-primary transition-colors group-hover:text-foreground">
                {initial}
              </span>
              <span className="hidden h-8 w-px bg-white/20 sm:block" />
              <div className="hidden flex-col sm:flex">
                <span className="font-heading text-sm tracking-[0.2em] text-white">
                  {titleFirst}
                </span>
                <span className="font-heading text-[10px] tracking-[0.18em] text-white/70">
                  {titleSecond}
                </span>
              </div>
            </Link>
          </div>

          {/* Center statement */}
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="font-heading text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {statementLines.map((line, i) => (
                <LineReveal key={i} delay={i * 150} className={i > 0 ? "mt-2" : ""}>
                  {line}
                </LineReveal>
              ))}
            </h1>

            <button
              type="button"
              onClick={() => scrollTo("#stories")}
              className="group mt-10 inline-flex cursor-pointer items-center gap-4 rounded-full focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors group-hover:border-primary group-hover:text-primary sm:size-14">
                <Play className="size-4 fill-current sm:size-5" />
              </span>
              <span className="text-sm font-medium tracking-[0.2em] text-white transition-colors group-hover:text-primary sm:text-base">
                观看我的旅程
              </span>
            </button>
          </div>

          {/* Bottom bar */}
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
            <SocialLinks
              links={bloggerData?.social_links}
              className="text-white/70"
              iconClassName="hover:bg-white/10 hover:text-white"
            />
            <button
              type="button"
              onClick={() => scrollTo("#about")}
              className="group flex cursor-pointer flex-col items-center gap-1 text-white/70 transition-colors hover:text-white focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-[10px] tracking-[0.2em]">向下探索</span>
              <ChevronDown className="size-4 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative bg-background py-20 md:py-28 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <ScrollReveal>
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted sm:aspect-[4/5]">
              {bloggerData?.avatar ? (
                <Image
                  src={bloggerData.avatar}
                  alt={nickname || title}
                  fill
                  unoptimized
                  className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="size-16 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </ScrollReveal>

          <div className="flex flex-col justify-center">
            <ScrollReveal>
              <span className="text-xs font-medium tracking-[0.2em] text-primary">(关于我)</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="mt-4 font-heading text-3xl font-light leading-tight text-foreground sm:text-4xl lg:text-5xl">
                {nickname || title}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <p className="mt-6 leading-relaxed text-foreground/80">
                {bloggerData?.bio || bloggerData?.blog_description || "用镜头记录光影与故事，在每一次快门中寻找世界的诗意。"}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="mt-10 grid grid-cols-3 gap-4 border-y border-border py-6">
                {[
                  { value: "15", label: "摄影年限" },
                  { value: "36", label: "足迹国家" },
                  { value: "128", label: "发表故事" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div className="font-heading text-3xl font-light text-primary sm:text-4xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <button
                type="button"
                onClick={() => scrollTo("#contact")}
                className="group mt-10 inline-flex w-fit cursor-pointer items-center gap-3 rounded-full border border-border px-6 py-3 text-sm font-medium tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
              >
                一起创作
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Portfolio Wall */}
      {portfoliosData.length > 0 && (
        <section id="stories" className="relative bg-background py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-medium tracking-[0.2em] text-primary">(精选作品)</span>
                <h2 className="mt-2 font-heading text-3xl font-light tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  精选故事
                </h2>
              </div>
              <Link
                href="/portfolios"
                className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                查看全部
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>
          </div>

          <div
            ref={wallRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={cn(
              "flex cursor-grab gap-4 overflow-x-auto px-4 pb-4 pt-2 sm:gap-6 sm:px-6 lg:gap-8 lg:px-8",
              "scrollbar-hide"
            )}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {portfoliosData.map((portfolio, index) => {
              const year = portfolio.created_at
                ? new Date(portfolio.created_at).getFullYear()
                : "";
              const number = String(index + 1).padStart(2, "0");
              return (
                <Link
                  key={portfolio.id}
                  href={`/portfolios/${portfolio.id}`}
                  className="group relative block h-[70vh] w-[85vw] flex-shrink-0 overflow-hidden bg-muted sm:w-[60vw] md:w-[45vw] lg:h-[78vh] lg:w-[clamp(360px,28vw,460px)] focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={(e) => {
                    if (isDragging) {
                      e.preventDefault();
                    }
                  }}
                >
                  {portfolio.cover_url ? (
                    <Image
                      src={portfolio.cover_url}
                      alt={portfolio.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 28vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="size-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute left-5 top-5 font-heading text-5xl font-light text-white/20 sm:text-6xl">
                    {number}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="mb-2 flex items-center gap-3 text-xs tracking-wider text-white/70">
                      {portfolio.category_name && <span>{portfolio.category_name}</span>}
                      {portfolio.category_name && year && <span className="text-white/40">·</span>}
                      {year && <span>{year}</span>}
                    </div>
                    <h3 className="font-heading text-2xl font-light text-white sm:text-3xl">
                      {portfolio.name}
                    </h3>
                    {portfolio.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/70">
                        {portfolio.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Journal */}
      {articlesData.length > 0 && (
        <section id="journal" className="relative bg-background py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-medium tracking-[0.2em] text-primary">(日志)</span>
                <h2 className="mt-2 font-heading text-3xl font-light tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  最新故事
                </h2>
              </div>
              <Link
                href="/articles"
                className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                查看全部
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
              {/* Featured article */}
              <ScrollReveal>
                <Link
                  href={`/articles/${articlesData[0].slug}`}
                  className="group block h-full overflow-hidden bg-card focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted lg:aspect-[4/3]">
                    {articlesData[0].cover_image ? (
                      <Image
                        src={articlesData[0].cover_image}
                        alt={articlesData[0].title}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="size-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="text-xs font-medium tracking-[0.15em] text-primary">
                      精选
                    </span>
                    <h3 className="mt-3 font-heading text-2xl font-light leading-snug text-foreground sm:text-3xl">
                      {articlesData[0].title}
                    </h3>
                    {articlesData[0].summary && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {articlesData[0].summary}
                      </p>
                    )}
                  </div>
                </Link>
              </ScrollReveal>

              {/* Article list */}
              <div className="flex flex-col gap-4 sm:gap-6">
                {articlesData.slice(1).map((article, i) => (
                  <ScrollReveal key={article.id} delay={i * 100}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="group flex cursor-pointer gap-4 overflow-hidden border-b border-border pb-4 sm:gap-5 sm:pb-6 focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="relative aspect-square w-24 flex-shrink-0 overflow-hidden bg-muted sm:w-28">
                        {article.cover_image ? (
                          <Image
                            src={article.cover_image}
                            alt={article.title}
                            fill
                            unoptimized
                            sizes="112px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="size-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] tracking-[0.15em] text-muted-foreground">
                          {article.category_name || "故事"}
                        </span>
                        <h4 className="mt-1 font-heading text-lg font-light leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
                          {article.title}
                        </h4>
                        {article.summary && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {article.summary}
                          </p>
                        )}
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quote */}
      <section id="quote" className="relative min-h-screen w-full">
        {quoteBg ? (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={quoteBg}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-4xl">
            <blockquote className="font-heading text-3xl font-light leading-snug text-white sm:text-4xl md:text-5xl lg:text-6xl">
              “摄影是发现的艺术。”
            </blockquote>
            <cite className="mt-6 block text-sm not-italic tracking-[0.2em] text-white/60 sm:text-base">
              — {nickname || title}
            </cite>
          </ScrollReveal>
        </div>
      </section>

      {/* Gear */}
      <section id="gear" className="relative bg-background py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 text-center">
            <span className="text-xs font-medium tracking-[0.2em] text-primary">(装备)</span>
            <h2 className="mt-2 font-heading text-3xl font-light tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              我的装备
            </h2>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: "相机", name: "LEICA M11" },
              { label: "镜头", name: "35mm Summilux" },
              { label: "胶片", name: "Kodak Portra 400" },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 100}>
                <div className="group flex flex-col items-center border border-border bg-card p-8 text-center transition-colors hover:border-primary/50 sm:p-10">
                  <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="mt-3 font-heading text-2xl font-light text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                    {item.name}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative border-t border-border bg-background py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-4xl font-light leading-tight text-foreground sm:text-5xl lg:text-6xl">
              让我们一起创造故事
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
              编辑 · 旅行 · 纪实
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="mt-8 inline-block cursor-pointer rounded-md font-heading text-xl font-light tracking-wide text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:text-2xl"
              >
                {email}
              </a>
            ) : (
              <span className="mt-8 inline-block text-muted-foreground">
                联系邮箱待设置
              </span>
            )}
          </ScrollReveal>
        </div>
      </section>

      {portfoliosData.length === 0 && articlesData.length === 0 && (
        <EmptyState title="内容即将上线" description="博主还没有发布作品集或文章" />
      )}
    </div>
  );
}
