"use client";

import Image from "next/image";
import { Search, Send } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";

interface HeroSectionProps {
  profile: BloggerProfile | null;
}

const DEFAULT_BIO = "一个热爱旅行的普通女生。用镜头和文字，分享路上的风景与故事。";

export function HeroSection({ profile }: HeroSectionProps) {
  const backgroundUrl = profile?.page_background;

  return (
    <section className="relative flex h-[min(38vw,600px)] min-h-[440px] items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#41837a_0%,#33685f_55%,#27524b_100%)]">
        {backgroundUrl && (
          <Image
            src={backgroundUrl}
            alt={profile?.blog_title || "旅行封面"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* 左侧压暗保证文字可读 */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,32,28,0.55)_0%,rgba(15,32,28,0.25)_45%,rgba(15,32,28,0.05)_75%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl py-16">
          <h1 className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-4xl leading-tight text-white drop-shadow-md sm:text-5xl md:text-[3.4rem]">
            去看更大的世界
            <Send
              className="h-8 w-8 -rotate-12 text-white/90 drop-shadow"
              strokeWidth={1.5}
            />
          </h1>

          <p className="mt-5 flex items-center gap-3 text-base font-medium tracking-[0.35em] text-white/90 md:text-lg">
            旅行
            <span className="h-1 w-1 rounded-full bg-white/70" />
            生活
            <span className="h-1 w-1 rounded-full bg-white/70" />
            记录
            <span className="h-1 w-1 rounded-full bg-white/70" />
            成长
          </p>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
            {profile?.bio || DEFAULT_BIO}
          </p>

          {/* Search（纯 HTML GET 表单，静态托管可用；提交到攻略检索） */}
          <form action="/travels" method="GET" className="mt-8 flex max-w-md items-center rounded-full bg-white p-1.5 shadow-card">
            <Search
              className="ml-3 h-4.5 w-4.5 shrink-0 text-text-subtle"
              strokeWidth={1.8}
            />
            <input
              type="search"
              name="keyword"
              placeholder="搜索你想去的目的地 / 攻略 / 关键词..."
              aria-label="搜索你想去的目的地、攻略或关键词"
              className="min-h-9 w-full bg-transparent px-3 text-sm text-text-primary placeholder:text-text-subtle focus:outline-none"
            />
            <button
              type="submit"
              aria-label="搜索"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              <Send className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </form>
        </div>
      </div>

      {/* 手写签名（右下） */}
      <p className="absolute bottom-8 right-6 z-10 select-none text-right font-hand text-2xl leading-tight text-white/95 drop-shadow-md md:text-3xl">
        Better
        <br />
        Travel
        <br />
        Bigger
        <br />
        Life ♡
      </p>
    </section>
  );
}
