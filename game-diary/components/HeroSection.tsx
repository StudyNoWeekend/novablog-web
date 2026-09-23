"use client";

import Link from "next/link";
import { Crown, Gamepad2, Link as LinkIcon, Mail, Play } from "lucide-react";
import type { BloggerProfile, SocialLink } from "@/lib/api/blogger";

interface HeroSectionProps {
  profile: BloggerProfile | null;
}

const platformIconMap: Record<string, React.ElementType> = {
  bilibili: Play,
  youtube: Play,
  weibo: LinkIcon,
  steam: Gamepad2,
  twitter: LinkIcon,
  x: LinkIcon,
  twitch: Play,
  email: Mail,
};

function getSocialIcon(platform: string): React.ElementType {
  const key = platform.toLowerCase();
  return platformIconMap[key] ?? LinkIcon;
}

function sortSocialLinks(links: SocialLink[]): SocialLink[] {
  return [...links].sort((a, b) => a.sort_order - b.sort_order);
}

export function HeroSection({ profile }: HeroSectionProps) {
  const backgroundUrl = profile?.page_background;
  const hasApiSocialLinks =
    profile && profile.social_links && profile.social_links.length > 0;

  return (
    <section className="relative overflow-hidden">
      {/* 氛围光斑 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-accent/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent-2/15 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:pt-16 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-24">
        {/* Left: copy */}
        <div>
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-400" strokeWidth={1.8} />
            <h1 className="font-heading text-4xl font-black leading-tight text-text-primary md:text-5xl">
              用游戏记录
              <span className="text-gradient">热爱</span>
            </h1>
          </div>
          <p className="mt-3 font-heading text-base italic text-text-muted md:text-lg">
            —— 一个游戏爱好者的分享主页
          </p>

          {profile ? (
            <div className="mt-8 space-y-1.5 text-[15px] leading-relaxed text-text-secondary">
              {profile.blog_description && (
                <p className="whitespace-pre-line">{profile.blog_description}</p>
              )}
              {profile.bio && (
                <p className="whitespace-pre-line text-text-muted">{profile.bio}</p>
              )}
            </div>
          ) : (
            <div className="mt-8 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-text-muted/15" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-text-muted/15" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-text-muted/15" />
            </div>
          )}

          {/* CTA buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/videos"
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-gradient-theme px-6 text-sm font-bold text-white shadow-glow transition-opacity duration-200 ease-out hover:opacity-90"
            >
              <Play className="h-4 w-4 fill-current" strokeWidth={1.8} />
              观看最新视频
            </Link>
            <Link
              href="/articles"
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border-strong bg-surface px-6 text-sm font-bold text-text-secondary transition-colors duration-200 ease-out hover:border-accent hover:text-accent-hover"
            >
              浏览文章
            </Link>
          </div>

          {/* Social icons */}
          {profile && hasApiSocialLinks && (
            <div className="mt-8 flex items-center gap-3">
              {sortSocialLinks(profile.social_links).map((link) => {
                const Icon = getSocialIcon(link.platform);
                const isEmail = link.platform.toLowerCase() === "email";
                const href =
                  isEmail && !link.url.startsWith("mailto:")
                    ? `mailto:${link.url}`
                    : link.url;
                return (
                  <a
                    key={`${link.platform}-${link.sort_order}`}
                    href={href}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    aria-label={link.name || link.platform}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition-all duration-200 ease-out hover:border-accent hover:text-accent-hover"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: visual panel */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-radius-lg border border-border shadow-card">
            {backgroundUrl ? (
              // 博主配置的页面背景图作为主视觉
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={backgroundUrl}
                alt={profile?.blog_title || "游戏主视觉"}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#221a44] via-[#171233] to-[#0d0b1a]">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_25%_25%,rgba(139,92,246,.8)_2px,transparent_2px)] [background-size:22px_22px]"
                />
                <Gamepad2
                  className="h-28 w-28 text-accent-hover/70"
                  strokeWidth={1.2}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/10" />

            {/* 悬浮徽章 */}
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 backdrop-blur-md">
              <Gamepad2 className="h-4 w-4 text-accent-hover" strokeWidth={1.8} />
              <span className="text-xs font-bold tracking-wide text-white">
                Better Games · Better Life
              </span>
            </div>
            {profile?.nickname && (
              <div className="absolute bottom-5 right-5 rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-right backdrop-blur-md">
                <p className="text-sm font-extrabold text-white">
                  {profile.nickname}
                </p>
                <p className="text-[11px] font-semibold tracking-wider text-accent-hover">
                  游戏博主 · 一起玩吧
                </p>
              </div>
            )}
          </div>

          {/* 漂浮装饰 */}
          <div
            aria-hidden
            className="absolute -left-6 -top-6 flex h-14 w-14 animate-float items-center justify-center rounded-2xl bg-gradient-theme shadow-glow"
          >
            <Gamepad2 className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </section>
  );
}
