"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cat, Heart, Mail, MapPin, Smile } from "lucide-react";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { SocialIcon } from "@/components/SocialIcon";

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

export function AboutContent() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    getBloggerProfile().then((data) => {
      if (!cancelled) setProfile(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const bioLines = (profile?.bio || "").split("\n").filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      {/* 博主名片 */}
      <div className="relative overflow-hidden rounded-radius-lg border border-border bg-surface p-8 shadow-card md:p-10">
        <Heart
          aria-hidden="true"
          className="absolute -right-4 -top-4 h-24 w-24 fill-accent-subtle text-transparent"
          strokeWidth={1.5}
        />
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="relative shrink-0">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-accent/30 bg-background-soft">
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.nickname}
                  fill
                  sizes="128px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Cat className="h-12 w-12 text-text-subtle" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <Heart
              aria-hidden="true"
              className="absolute -right-1 -top-1 h-7 w-7 animate-floaty fill-accent text-accent"
              strokeWidth={1.5}
            />
          </div>

          <div className="min-w-0 flex-1 text-center md:text-left">
            <h2 className="font-heading text-3xl text-text-primary">
              {profile?.nickname || "二次元博主"}
            </h2>
            <p className="mt-1.5 text-sm text-text-muted">
              一位热爱二次元的内容创作者 / 画师 / 分享者
            </p>
            <div className="mt-4 space-y-1.5 text-sm leading-relaxed text-text-secondary">
              {bioLines.length > 0 ? (
                bioLines.map((line, i) => <p key={i}>{line}</p>)
              ) : (
                <p>欢迎来到我的小站！很高兴能和同样喜欢二次元的你相遇～</p>
              )}
            </div>

            {profile?.tags && profile.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
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

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted md:justify-start">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex cursor-pointer items-center gap-1 transition-colors duration-200 hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {profile.email}
                </a>
              )}
              {profile?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {profile.city}
                </span>
              )}
            </div>

            {profile?.social_links && profile.social_links.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {profile.social_links.map((link) => (
                  <SocialIcon
                    key={`${link.platform}-${link.url}`}
                    platform={link.name || link.platform}
                    url={link.url}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 关于博客 */}
      <div className="mt-8 rounded-radius-lg border border-border bg-surface p-8 shadow-card">
        <h3 className="flex items-center gap-2 font-heading text-xl text-text-primary">
          <Smile className="h-5 w-5 text-accent" strokeWidth={1.5} />
          关于这个小站
        </h3>
        <p className="mt-4 leading-relaxed text-text-secondary">
          {profile?.blog_description ||
            "这里记录着我对动漫、游戏、插画的热爱，也有生活中的一些碎碎念。希望能和同样喜欢二次元的你，一起发现更多有趣的东西，把喜欢的东西变成更有意义的生活！"}
        </p>
        <Link
          href="/articles"
          className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
        >
          <Heart className="h-4 w-4 fill-current" strokeWidth={1.5} />
          去看看我的动态
        </Link>
      </div>
    </div>
  );
}
