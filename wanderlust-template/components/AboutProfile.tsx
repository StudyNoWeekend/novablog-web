"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Mail, MapPin, Mountain } from "lucide-react";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { SocialIcons } from "@/components/SocialIcons";

/**
 * 关于我：博主资料 + 标签 + 社交链接（客户端运行时取数，静态导出下实时展示）。
 */
export function AboutProfile() {
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
          <h1 className="font-display text-4xl text-text-primary md:text-5xl">
            关于我
            <span className="ml-3 align-middle font-hand text-2xl font-medium text-accent/70">
              About Me
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            一个热爱旅行的人，想把世界讲给你听
          </p>
        </div>
      </section>

      {/* Profile */}
      <section className="flex-1 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              <div className="h-48 w-48 animate-pulse rounded-full bg-background-soft" />
              <div className="w-full space-y-4">
                <div className="h-8 w-40 animate-pulse rounded bg-background-soft" />
                <div className="h-4 w-full animate-pulse rounded bg-background-soft" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-background-soft" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-14">
              {/* Avatar */}
              <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full border-4 border-surface shadow-card md:h-60 md:w-60">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.nickname || ""}
                    fill
                    sizes="(max-width: 768px) 192px, 240px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-background-soft">
                    <Mountain className="h-12 w-12 text-accent/40" strokeWidth={1.2} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
                <h2 className="flex items-center gap-2 font-display text-3xl text-text-primary">
                  Hi，我是{profile?.nickname || "旅行者"}
                  <Heart className="h-5 w-5 fill-accent text-accent" strokeWidth={0} />
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
                        className="flex cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-accent"
                      >
                        <Mail className="h-4 w-4" strokeWidth={1.5} />
                        {profile.email}
                      </a>
                    )}
                    {profile?.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" strokeWidth={1.5} />
                        {profile.city}
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

                <Link
                  href="/"
                  className="brush-bg-strong mt-8 inline-flex min-h-11 -rotate-2 cursor-pointer items-center px-7 text-sm font-medium tracking-wide text-white shadow-card transition-all duration-300 ease-out hover:rotate-0 hover:shadow-card-hover"
                >
                  去看看我的游记
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
