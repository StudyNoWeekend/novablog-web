"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";

interface HeroSectionProps {
  profile: BloggerProfile | null;
  covers: { url: string; title: string }[];
}

const DEFAULT_BIO =
  "一个热爱美食的生活记录者，喜欢在厨房里探索，在旅途中寻找地道美味，和你一起发现更多好吃的。";

/** 首页 Hero：暖色照片背景 + 手写标语 + 拍立得照片堆（对应 UI 图首屏） */
export function HeroSection({ profile, covers }: HeroSectionProps) {
  const backgroundUrl = profile?.page_background;

  return (
    <section className="relative flex min-h-[480px] items-center overflow-hidden h-[min(46vw,600px)]">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#f6dfba_0%,#efcb96_50%,#e7b877_100%)]">
        {backgroundUrl && (
          <Image
            src={backgroundUrl}
            alt={profile?.blog_title || "美食封面"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* 左侧压暗保证文字可读 */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(43,26,14,0.62)_0%,rgba(43,26,14,0.32)_45%,rgba(43,26,14,0.06)_75%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl py-16 md:py-20">
          <p className="font-hand text-2xl text-white/85 drop-shadow-sm">
            Welcome to my food diary ♡
          </p>

          {/* 标语（主题手账风文案，与漫游世界主题的 Hero 文案同模式） */}
          <h1 className="mt-3 font-display text-4xl leading-[1.25] text-white drop-shadow-md sm:text-5xl md:text-[3.2rem]">
            把平凡的食材
            <br />
            做成不平凡的幸福
            <svg
              aria-hidden="true"
              viewBox="0 0 220 14"
              className="mt-2 block h-3 w-44 text-accent sm:w-56"
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

          <p className="mt-6 max-w-md text-sm leading-loose text-white/90 drop-shadow-sm md:text-base">
            {profile?.bio || DEFAULT_BIO}
          </p>

          <Link
            href="/articles"
            className="mt-8 inline-flex min-h-12 -rotate-1 cursor-pointer items-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold tracking-wide text-white shadow-card transition-all duration-300 ease-out hover:rotate-0 hover:bg-accent-hover hover:shadow-card-hover"
          >
            走进我的美食世界
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      {/* 拍立得照片堆（桌面端） */}
      <div aria-hidden="true" className="absolute bottom-10 right-10 z-10 hidden lg:block xl:right-16">
        {covers[1]?.url ? (
          <div className="polaroid absolute -right-6 top-10 w-40 rotate-6 xl:w-44">
            <span className="tape" />
            <div className="relative aspect-square overflow-hidden rounded-sm bg-background-soft">
              <Image
                src={covers[1].url}
                alt=""
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 truncate text-center font-hand text-lg leading-none text-text-muted">
              tasty!
            </p>
          </div>
        ) : null}
        <div className="polaroid relative w-44 -rotate-3 xl:w-48">
          <span className="tape" style={{ transform: "translateX(-50%) rotate(4deg)" }} />
          {covers[0]?.url ? (
            <div className="relative aspect-square overflow-hidden rounded-sm bg-background-soft">
              <Image
                src={covers[0].url}
                alt=""
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-sm bg-background-soft">
              <UtensilsCrossed className="h-10 w-10 text-text-subtle" strokeWidth={1.2} />
            </div>
          )}
          <p className="mt-2 truncate text-center font-hand text-lg leading-none text-text-muted">
            yummy ♡
          </p>
        </div>
      </div>
    </section>
  );
}
