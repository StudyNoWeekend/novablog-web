"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { SocialIcons } from "@/components/SocialIcons";
import { CatFace, CrownDoodle, PawPrint, Sparkle } from "@/components/ComicDoodle";

/** 关于我：拍立得头像 + 简介 + 标签 + 社交链接 */
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

  const nickname = profile?.nickname || "漫画家小町";
  const bioLines = (profile?.bio || "一个热爱漫画、也热爱生活的创作者。")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const tags =
    profile?.tags && profile.tags.length > 0
      ? profile.tags
      : ["原创漫画", "日常随笔", "绘画分享", "ACG热爱"];

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <p className="font-hand text-2xl text-accent-hover">About Me</p>
          <h1 className="mt-1 font-display text-4xl text-text-primary md:text-5xl">
            关于我
          </h1>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[auto_1fr]">
          {/* 拍立得头像 */}
          <div className="mx-auto w-fit rotate-[-3deg]">
            <div className="rounded-radius-sm border border-border bg-surface p-3 pb-12 shadow-card">
              <div className="relative h-44 w-44 overflow-hidden rounded-sm border border-border bg-background-soft">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={nickname}
                    fill
                    sizes="176px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <CatFace className="h-16 w-16 text-text-subtle" />
                  </div>
                )}
              </div>
            </div>
            <p className="mt-2 text-center font-hand text-xl text-text-muted">
              {nickname}
            </p>
          </div>

          {/* 简介卡片 */}
          <div className="relative rounded-radius-lg border border-border bg-surface p-6 shadow-card sm:p-8">
            <CrownDoodle className="absolute -top-4 right-6 h-9 w-11 rotate-6" />

            <h2 className="font-display text-2xl text-text-primary">
              你好，我是{nickname}
            </h2>
            <div className="mt-4 space-y-2.5 text-base leading-relaxed text-text-secondary">
              {bioLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {profile?.city && (
              <p className="mt-4 flex items-center gap-1.5 text-sm text-text-muted">
                <MapPin className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
                {profile.city}
              </p>
            )}

            {/* 标签 */}
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border-strong bg-background px-3.5 py-1.5 text-xs text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 社交链接 */}
            {profile?.social_links && profile.social_links.length > 0 && (
              <div className="mt-7 border-t border-dashed border-border-strong pt-5">
                <p className="mb-3 flex items-center gap-2 text-sm font-medium text-text-primary">
                  <Sparkle className="h-3.5 w-3.5 text-accent-hover" />
                  来这些地方找我玩
                </p>
                <SocialIcons links={profile.social_links} size="lg" />
              </div>
            )}

            <p className="mt-6 text-right font-hand text-xl text-text-secondary">
              谢谢你，愿意来看我的世界！
              <PawPrint className="ml-1.5 inline h-4 w-4 -rotate-12 text-accent-hover" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
