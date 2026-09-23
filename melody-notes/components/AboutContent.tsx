"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Headphones, MapPin } from "lucide-react";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getSongs, getPlaylists } from "@/lib/api/music";
import { SocialIcons } from "@/components/SocialIcons";

interface AboutData {
  profile: BloggerProfile | null;
  articleCount: number | null;
  songCount: number | null;
  playlistCount: number | null;
}

export function AboutContent() {
  const [data, setData] = useState<AboutData>({
    profile: null,
    articleCount: null,
    songCount: null,
    playlistCount: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [profile, articles, songs, playlists] = await Promise.all([
        getBloggerProfile(),
        getArticles({ page: 1, page_size: 1 }),
        getSongs({ page: 1, page_size: 1 }),
        getPlaylists(),
      ]);
      if (cancelled) return;
      setData({
        profile,
        articleCount: articles.total,
        songCount: songs.total,
        playlistCount: playlists.length,
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const profile = data.profile;

  return (
    <div className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Headphones className="mx-auto h-10 w-10 text-accent" strokeWidth={1.5} />
          <h1 className="mt-4 text-3xl font-bold text-text-primary md:text-4xl">关于我</h1>
          <p className="mt-3 text-sm text-text-muted md:text-base">
            用音乐，记录生活的每一种情绪。
          </p>
        </div>
      </section>

      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {loading ? (
            <div className="animate-pulse space-y-4 rounded-xl border border-border bg-surface p-8">
              <div className="mx-auto h-24 w-24 rounded-full bg-surface-elevated" />
              <div className="mx-auto h-5 w-32 rounded bg-surface-elevated" />
              <div className="h-3 w-full rounded bg-surface-elevated" />
              <div className="h-3 w-2/3 mx-auto rounded bg-surface-elevated" />
            </div>
          ) : (
            <>
              {/* Profile card */}
              <div className="rounded-xl border border-border bg-surface p-8 text-center shadow-card">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.nickname}
                    className="mx-auto h-24 w-24 rounded-full border-2 border-accent/60 object-cover"
                  />
                ) : (
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent/60 bg-surface-elevated text-3xl font-bold text-accent">
                    {(profile?.nickname || "M").slice(0, 1)}
                  </div>
                )}
                <h2 className="mt-4 text-2xl font-bold text-text-primary">
                  {profile?.nickname || "Melody Notes"}
                </h2>
                {profile?.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{profile.bio}</p>
                )}
                {profile?.city && (
                  <p className="mt-1 flex items-center justify-center gap-1 text-xs text-text-subtle">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {profile.city}
                  </p>
                )}

                {/* 统计 */}
                <div className="mx-auto mt-6 grid max-w-md grid-cols-3 divide-x divide-border rounded-lg border border-border bg-background-soft py-4">
                  <div>
                    <p className="text-xs text-text-subtle">文章</p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-text-primary">
                      {data.articleCount ?? "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-subtle">歌曲</p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-text-primary">
                      {data.songCount ?? "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-subtle">歌单</p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-text-primary">
                      {data.playlistCount ?? "--"}
                    </p>
                  </div>
                </div>

                {profile?.social_links && profile.social_links.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <SocialIcons links={profile.social_links} size="lg" />
                  </div>
                )}
              </div>

              {/* 简介 */}
              <div className="mt-8 rounded-xl border border-border bg-surface p-8 shadow-card">
                <h3 className="font-[var(--font-script)] text-2xl text-accent">About Me ♪</h3>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-secondary">
                  <p>
                    {profile?.blog_description ||
                      "这里是我的音乐角落，分享我喜欢的歌、歌单、音乐故事，也期待和你一起，发现更多好听的声音。"}
                  </p>
                  {profile?.tags && profile.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {profile.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-accent/25 bg-accent-subtle px-3 py-1 text-xs text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/music"
                    className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent-strong px-6 text-sm font-medium text-on-accent transition-colors duration-200 hover:bg-accent-hover"
                  >
                    去听歌
                  </Link>
                  <Link
                    href="/articles"
                    className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-border px-6 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-accent/50 hover:text-accent"
                  >
                    读文章
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
