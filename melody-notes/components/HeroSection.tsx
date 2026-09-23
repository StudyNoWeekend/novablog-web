"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Music2 } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";

/** 标题下的手绘波浪下划线 */
function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 12"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M3 8.5C28 3.5 52 3 78 6.5C104 10 128 10.5 154 7C176 4 196 4 217 7.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface HeroSectionProps {
  profile: BloggerProfile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const title = profile?.blog_title || "Melody Notes";
  const intro =
    profile?.blog_description ||
    "这里是我的音乐角落，分享我喜欢的歌、歌单、音乐故事，也期待和你一起，发现更多好听的声音。";

  return (
    <section className="relative overflow-hidden">
      {/* 背景：优先博主设置的页面背景图，否则使用夜色渐变 + 唱片纹理 */}
      <div className="absolute inset-0">
        {profile?.page_background ? (
          <Image
            src={profile.page_background}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(120%_140%_at_85%_10%,#1d3a2c_0%,#12241c_38%,#0c1310_78%)]" />
        )}
        {/* 暗色压层，保证文字可读 */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* 装饰：右侧黑胶唱片 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 opacity-25 lg:block"
      >
        <svg width="420" height="420" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-accent" />
          <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-accent" />
          <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-accent" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-accent" />
          <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-accent" />
          <circle cx="100" cy="100" r="18" fill="#16211c" stroke="currentColor" strokeWidth="0.8" className="text-accent" />
          <circle cx="100" cy="100" r="4" fill="currentColor" className="text-accent" />
        </svg>
      </div>

      {/* 装饰：漂浮音符 */}
      <Music2
        aria-hidden="true"
        className="float-slow pointer-events-none absolute right-[22%] top-16 hidden h-8 w-8 text-accent/50 md:block"
        strokeWidth={1.5}
      />
      <Music2
        aria-hidden="true"
        className="float-slow pointer-events-none absolute right-[38%] top-40 hidden h-5 w-5 text-accent/30 [animation-delay:-2.5s] md:block"
        strokeWidth={1.5}
      />

      {/* 内容 */}
      <div className="relative mx-auto flex min-h-[26rem] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 md:min-h-[30rem] lg:px-8">
        <p className="mb-4 font-[var(--font-script)] text-xl text-accent/90">
          {title} ♫
        </p>
        <h1 className="text-4xl font-bold leading-[1.15] text-text-primary md:text-5xl lg:text-[3.4rem]">
          用音乐
          <br />
          <span className="relative inline-block">
            记录生活的每一种情绪
            <Squiggle className="absolute -bottom-2 left-0 h-3 w-[105%] text-accent" />
          </span>
          <span className="ml-2 inline-block align-top text-2xl text-accent md:text-3xl">♪</span>
        </h1>
        <p className="mt-7 max-w-xl whitespace-pre-line text-[15px] leading-relaxed text-text-secondary md:text-base">
          {intro}
        </p>
        <div className="mt-9">
          <Link
            href="/playlists"
            className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent-strong px-6 text-sm font-medium text-on-accent transition-all duration-200 ease-out hover:bg-accent-hover hover:shadow-glow"
          >
            探索我的歌单
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
