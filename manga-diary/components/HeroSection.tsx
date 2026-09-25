"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  CrownDoodle,
  HeroIllustration,
  Sparkle,
} from "@/components/ComicDoodle";
import type { BloggerProfile } from "@/lib/api/blogger";

interface HeroSectionProps {
  profile: BloggerProfile | null;
}

/**
 * 首页主视觉：左侧手写问候 + 标签胶囊 + CTA，右侧漫画桌涂鸦场景。
 * 数据仅取博主资料（昵称 / 简介 / 标签），接口未就绪时回退到主题文案。
 */
export function HeroSection({ profile }: HeroSectionProps) {
  const nickname = profile?.nickname || "漫画家小町";
  const tagline =
    profile?.blog_description || "用漫画记录生活";
  const intro =
    profile?.bio
      ? profile.bio.split("\n").filter(Boolean).slice(0, 2).join("，")
      : "一个热爱漫画、也热爱生活的创作者。";
  const tags =
    profile?.tags && profile.tags.length > 0
      ? profile.tags.slice(0, 4)
      : ["原创漫画", "日常随笔", "绘画分享", "ACG热爱"];

  return (
    <section className="relative overflow-hidden bg-background">
      {/* 网点装饰 */}
      <div className="halftone pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full opacity-60" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-4 lg:px-8">
        {/* 左列：问候 + 标签 + CTA */}
        <div className="relative z-10 max-w-xl">
          <div className="mb-4 flex items-end gap-3">
            <CrownDoodle className="h-9 w-11 -rotate-12" />
            <Sparkle className="mb-5 h-3.5 w-3.5" />
          </div>

          <h1 className="font-display text-4xl leading-snug text-text-primary sm:text-5xl">
            你好！
            <br />
            <span className="marker-underline">我是{nickname}</span>
          </h1>

          <p className="mt-6 text-base leading-relaxed text-text-secondary sm:text-lg">
            {intro}
          </p>
          <p className="mt-2 font-hand text-2xl leading-snug text-accent-hover">
            {tagline} !
          </p>

          {/* 标签胶囊 */}
          <div className="mt-7 flex flex-wrap gap-2.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border-strong bg-surface px-4 py-1.5 text-sm text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/portfolio"
            className="group mt-8 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-ink px-7 text-base text-white shadow-card transition-all duration-200 ease-out hover:bg-ink-soft hover:shadow-card-hover"
          >
            探索我的作品
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </div>

        {/* 右列：漫画桌涂鸦场景 */}
        <div className="relative">
          <HeroIllustration className="mx-auto w-full max-w-xl drop-shadow-[0_18px_36px_rgba(42,37,28,0.12)]" />
        </div>
      </div>
    </section>
  );
}
