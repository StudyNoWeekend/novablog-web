"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChefHat, Heart } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import { SocialIcons } from "@/components/SocialIcons";

interface AboutCardProps {
  profile: BloggerProfile | null;
  loading: boolean;
}

/** 首页侧栏「关于我」卡片（对应 UI 图右侧卡片） */
export function AboutCard({ profile, loading }: AboutCardProps) {
  const role = profile?.tags?.length
    ? profile.tags.slice(0, 2).join(" · ")
    : "美食博主 · 生活记录者";

  return (
    <aside className="relative w-full shrink-0 self-start overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-card lg:w-[300px]">
      {/* 顶部纸胶带 */}
      <span aria-hidden="true" className="tape left-1/2 w-20" />

      <div className="flex flex-col items-center text-center">
        <p className="flex items-center gap-1.5 font-display text-lg text-text-primary">
          <ChefHat className="h-4.5 w-4.5 text-accent" strokeWidth={1.6} />
          关于我
          <Heart className="h-3.5 w-3.5 fill-berry text-berry" strokeWidth={0} />
        </p>

        {loading ? (
          <div className="mt-5 flex w-full flex-col items-center gap-3">
            <div className="h-24 w-24 animate-pulse rounded-full bg-background-soft" />
            <div className="h-4 w-20 animate-pulse rounded bg-background-soft" />
            <div className="h-3 w-full animate-pulse rounded bg-background-soft" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-background-soft" />
          </div>
        ) : (
          <>
            {/* 头像 */}
            <div className="relative mt-5 h-24 w-24 overflow-hidden rounded-full border-2 border-accent/40 shadow-card">
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.nickname || ""}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-background-soft">
                  <ChefHat className="h-8 w-8 text-accent/50" strokeWidth={1.2} />
                </div>
              )}
            </div>

            <h3 className="mt-3 font-display text-xl text-text-primary">
              {profile?.nickname || "美食博主"}
            </h3>
            <p className="mt-0.5 text-xs text-text-muted">{role}</p>

            {profile?.bio && (
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-text-secondary">
                {profile.bio}
              </p>
            )}

            {profile?.social_links && profile.social_links.length > 0 && (
              <div className="mt-4">
                <SocialIcons links={profile.social_links} />
              </div>
            )}

            {/* 手写签名条 */}
            <p className="brush-bg mt-5 -rotate-2 px-4 py-1.5 font-hand text-xl leading-none text-accent-hover">
              关注我，一起吃遍世界 ♡
            </p>

            <Link
              href="/about"
              className="mt-5 inline-flex min-h-10 cursor-pointer items-center gap-1.5 text-sm font-medium text-text-muted transition-colors duration-200 hover:text-accent-hover"
            >
              了解更多
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
