"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smile } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";

interface HeroSectionProps {
  profile: BloggerProfile | null;
}

const DEFAULT_BIO =
  "一个热爱生活、喜欢创作的多媒体内容博主，分享有趣的日常、实用的干货和不设限的灵感。";

/** 内容形式标签行：优先取博主标签，缺省用主题默认组合 */
function formatLine(profile: BloggerProfile | null): string {
  const tags = profile?.tags?.filter(Boolean) ?? [];
  if (tags.length >= 2) return tags.join("  ×  ");
  return "视频  ×  图文  ×  直播  ×  创意内容";
}

/**
 * 首页 Hero：深墨色照片背景 + 手写体标语 + 黄色 CTA
 * （对应 UI 图首屏：暗色工作台照片、黄色波浪线、右侧竖排「记录 创造 分享」）
 */
export function HeroSection({ profile }: HeroSectionProps) {
  const backgroundUrl = profile?.page_background;

  return (
    <section className="relative flex min-h-[520px] items-center overflow-hidden bg-ink">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#1c1813_0%,#161310_55%,#241f16_100%)]">
        {backgroundUrl && (
          <Image
            src={backgroundUrl}
            alt={profile?.blog_title || "封面背景"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* 左侧压暗保证文字可读 */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,7,0.82)_0%,rgba(12,10,7,0.55)_45%,rgba(12,10,7,0.18)_80%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl py-20 md:py-28">
          {/* 手写体标语 + 黄色波浪线（对应 UI 图 Hero 主标题） */}
          <h1 className="font-display text-4xl leading-[1.3] text-white drop-shadow-md sm:text-5xl md:text-[3.4rem]">
            用多媒体记录
            <br />
            生活的更多可能
            <svg
              aria-hidden="true"
              viewBox="0 0 220 14"
              className="mt-3 block h-3 w-48 text-accent sm:w-60"
              fill="none"
            >
              <path
                d="M3 10 Q 20 3 40 9 T 80 8 T 120 10 T 160 7 T 217 9"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </h1>

          <p className="mt-7 text-sm font-medium tracking-wide text-white/90 md:text-base">
            {formatLine(profile)}
          </p>

          <p className="mt-4 max-w-md text-sm leading-loose text-white/70 md:text-base">
            {profile?.bio || profile?.blog_description || DEFAULT_BIO}
          </p>

          <Link
            href="/contact"
            className="mt-9 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold tracking-wide text-ink shadow-card transition-all duration-300 ease-out hover:bg-accent-hover hover:shadow-card-hover"
          >
            关注我，一起发现更多精彩
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      {/* 右侧竖排手写体（对应 UI 图「记录 创造 分享 — 阿柒」） */}
      <div
        aria-hidden="true"
        className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex xl:right-14"
      >
        <div className="flex flex-col items-center gap-3 font-display text-2xl leading-none text-white/85 [writing-mode:vertical-rl]">
          <span>记 录</span>
          <span>创 造</span>
          <span>分 享</span>
        </div>
        <span className="font-hand text-xl text-white/60">
          — {profile?.nickname || "me"}
        </span>
        <Smile className="h-6 w-6 text-accent" strokeWidth={1.5} />
      </div>
    </section>
  );
}
