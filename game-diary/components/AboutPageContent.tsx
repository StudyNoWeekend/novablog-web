"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Link as LinkIcon,
  Mail,
  MapPin,
  Play,
  UserRound,
} from "lucide-react";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getVideos } from "@/lib/api/videos";
import { getGames } from "@/lib/api/games";

const platformIconMap: Record<string, React.ElementType> = {
  bilibili: Play,
  youtube: Play,
  twitch: Play,
  steam: Gamepad2,
};

function getSocialIcon(platform: string): React.ElementType {
  const key = platform.toLowerCase();
  return platformIconMap[key] ?? LinkIcon;
}

export function AboutPageContent() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [stats, setStats] = useState({ articles: 0, videos: 0, games: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [p, articlesData, videosData, gamesData] = await Promise.all([
      getBloggerProfile(),
      getArticles({ page: 1, page_size: 1 }),
      getVideos({ page: 1, page_size: 1 }),
      getGames({ page: 1, page_size: 1 }),
    ]);
    setProfile(p);
    setStats({
      articles: articlesData.total,
      videos: videosData.total,
      games: gamesData.total,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const socialLinks =
    profile?.social_links?.sort((a, b) => a.sort_order - b.sort_order) ?? [];

  return (
    <div className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border bg-background-soft py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-black text-text-primary md:text-5xl">
            关于<span className="text-gradient">我</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            {profile?.blog_description || ""}
          </p>
        </div>
      </section>

      {/* Profile */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-16">
            {/* Avatar */}
            <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-3xl border-2 border-accent/40 shadow-glow sm:h-60 sm:w-60">
              {profile?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile?.nickname || ""}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface text-text-subtle">
                  <UserRound className="h-12 w-12" strokeWidth={1.2} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-3xl font-black text-text-primary sm:text-4xl">
                  {profile?.nickname || "游戏博主"}
                </h2>
                <span className="rounded-full bg-gradient-theme px-3 py-1 text-xs font-bold text-white">
                  游戏博主
                </span>
              </div>
              {profile?.city && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-text-muted">
                  <MapPin className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
                  {profile.city}
                </p>
              )}

              <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed text-text-secondary">
                {profile?.bio || ""}
              </p>

              {profile?.tags && profile.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                  {profile.tags.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-6 flex cursor-pointer items-center gap-2 break-all text-sm text-text-muted transition-colors duration-200 hover:text-accent-hover"
                >
                  <Mail className="h-4 w-4 shrink-0 text-text-subtle" strokeWidth={1.5} />
                  合作联系：{profile.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-background-soft py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {(
              [
                { label: "原创文章", value: stats.articles, href: "/articles" },
                { label: "视频作品", value: stats.videos, href: "/videos" },
                { label: "游戏收录", value: stats.games, href: "/games" },
              ] as const
            ).map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="group flex cursor-pointer flex-col items-center gap-2"
              >
                <p className="font-heading text-4xl font-black text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
                  {loading ? "—" : stat.value}
                </p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social links */}
      {socialLinks.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-black text-text-primary sm:text-3xl">
                关注我，一起玩游戏
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-text-muted">
                全平台同名，记得常来玩
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {socialLinks.map((social) => {
                const Icon = getSocialIcon(social.platform);
                const isEmail = social.platform.toLowerCase() === "email";
                const href =
                  isEmail && !social.url.startsWith("mailto:")
                    ? `mailto:${social.url}`
                    : social.url;
                return (
                  <a
                    key={`${social.platform}-${social.sort_order}`}
                    href={href}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    aria-label={social.name || social.platform}
                    className="group flex cursor-pointer items-center gap-3 rounded-radius-md border border-border bg-surface p-3 transition-all duration-200 ease-out hover:border-accent hover:bg-accent-subtle"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-text-muted transition-colors duration-200 ease-out group-hover:border-accent group-hover:text-accent-hover">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary">
                        {social.name || social.platform}
                      </p>
                      <p className="truncate text-xs text-text-muted">
                        {social.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
