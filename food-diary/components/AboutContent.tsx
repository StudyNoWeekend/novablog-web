"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChefHat, Heart, Mail, MapPin } from "lucide-react";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { SocialIcons } from "@/components/SocialIcons";

/**
 * 关于我：博主资料 + 标签 + 社交链接（客户端运行时取数，静态导出下实时展示）。
 * 头像采用拍立得相框呈现，贴合手账风。
 */
export function AboutContent() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getBloggerProfile().then((data) => {
      if (!cancelled) {
        setProfile(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const tags = profile?.tags ?? [];

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-hand text-2xl text-accent">About Me ♡</p>
          <h1 className="squiggle mx-auto mt-2 inline-block font-display text-4xl text-text-primary md:text-5xl">
            关于我
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted">
            一个热爱美食的人，想把厨房里的幸福讲给你听
          </p>
        </div>
      </section>

      {/* Profile */}
      <section className="flex-1 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              <div className="h-52 w-44 animate-pulse rounded-lg bg-background-soft" />
              <div className="w-full space-y-4">
                <div className="h-8 w-40 animate-pulse rounded bg-background-soft" />
                <div className="h-4 w-full animate-pulse rounded bg-background-soft" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-background-soft" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
              {/* 拍立得头像 */}
              <div className="polaroid relative w-52 shrink-0 rotate-2">
                <span className="tape" />
                <div className="relative aspect-square overflow-hidden rounded-sm bg-background-soft">
                  {profile?.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.nickname || ""}
                      fill
                      sizes="208px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ChefHat className="h-12 w-12 text-accent/40" strokeWidth={1.2} />
                    </div>
                  )}
                </div>
                <p className="mt-3 text-center font-hand text-2xl leading-none text-text-muted">
                  nice to eat you!
                </p>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
                <h2 className="flex items-center gap-2 font-display text-3xl text-text-primary">
                  Hi，我是{profile?.nickname || "美食爱好者"}
                  <Heart className="h-5 w-5 fill-berry text-berry" strokeWidth={0} />
                </h2>

                {profile?.bio && (
                  <p className="mt-5 max-w-xl whitespace-pre-line text-base leading-relaxed text-text-secondary">
                    {profile.bio}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                    {tags.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {(profile?.email || profile?.city) && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-text-muted md:justify-start">
                    {profile?.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-accent-hover"
                      >
                        <Mail className="h-4 w-4" strokeWidth={1.5} />
                        {profile.email}
                      </a>
                    )}
                    {profile?.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" strokeWidth={1.5} />
                        <span>{profile.city}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Social links */}
                {profile?.social_links && profile.social_links.length > 0 && (
                  <div className="mt-6">
                    <SocialIcons links={profile.social_links} size="lg" />
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <Link
                    href="/articles"
                    className="brush-bg-strong inline-flex min-h-11 -rotate-2 cursor-pointer items-center gap-2 px-7 text-sm font-medium tracking-wide text-white shadow-card transition-all duration-300 ease-out hover:rotate-0 hover:shadow-card-hover"
                  >
                    去看看我的美食日记
                    <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                  </Link>
                  <Link
                    href="/travels"
                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                  >
                    旅行美食
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
