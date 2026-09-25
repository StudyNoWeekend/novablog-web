"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Crown, Heart, PencilLine, Video, Youtube } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";

interface AboutSectionProps {
  profile: BloggerProfile | null;
  stats: {
    totalWorks: number;
    videoCount: number;
    articleCount: number;
  };
}

function StatCard({
  icon,
  label,
  value,
  caption,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-border bg-surface px-5 py-4 shadow-card">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent-hover">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">
          {label} <span className="font-display text-lg text-text-primary">{value}</span>
        </p>
        <p className="mt-0.5 truncate text-xs text-text-subtle">{caption}</p>
      </div>
    </div>
  );
}

/**
 * 首页 About 区块（对应 UI 图「About Me / 我是阿柒」）：
 * 左侧介绍 + 标签 pills，中间拍立得头像，右侧数据卡 + 手写感谢语
 */
export function AboutSection({ profile, stats }: AboutSectionProps) {
  const tags = profile?.tags?.filter(Boolean) ?? [
    "摄影",
    "剪辑",
    "写作",
    "旅行",
    "数码",
    "生活方式",
  ];

  return (
    <section className="bg-surface-highlight py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_auto_1fr] lg:gap-10">
          {/* 左：介绍 */}
          <div>
            <p className="flex items-center gap-2 font-hand text-2xl text-text-muted">
              About Me
              <Crown className="h-5 w-5 text-accent" strokeWidth={1.5} />
            </p>
            <h2 className="mt-2 font-display text-3xl leading-snug text-text-primary md:text-4xl">
              我是{profile?.nickname || "多媒体创作者"}
              <span className="squiggle ml-1 inline-block h-1 w-16 align-middle" aria-hidden="true" />
            </h2>
            <p className="mt-3 text-sm font-medium text-text-secondary md:text-base">
              {profile?.blog_description || "全网多媒体内容创作者 | 生活记录者 | 视觉爱好者"}
            </p>
            <p className="mt-5 max-w-md text-sm leading-loose text-text-muted md:text-base">
              {profile?.bio ||
                "我热爱用镜头和文字记录生活中的美好瞬间，也喜欢把有用的知识、真实的体验和有趣的想法分享给大家。希望通过我的内容，能让你在忙碌的生活中，找到一点共鸣、一点灵感和一点快乐。"}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {tags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-text-secondary shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 中：拍立得头像（纸胶带 + 手写欢迎语） */}
          <div className="relative mx-auto w-fit">
            <p
              aria-hidden="true"
              className="absolute -left-32 top-2 hidden -rotate-12 flex-col items-start font-display text-2xl leading-relaxed text-text-secondary lg:flex"
            >
              <span>欢迎来</span>
              <span>认识我</span>
              <ArrowDown className="ml-6 h-5 w-5 text-accent" strokeWidth={1.8} />
            </p>
            <div className="polaroid w-56 rotate-2 sm:w-64">
              <span className="tape" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-background-soft">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile?.nickname || "博主头像"}
                    fill
                    sizes="256px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-5xl text-text-subtle">
                    {profile?.nickname?.slice(0, 1) || "Hi"}
                  </div>
                )}
              </div>
              <p className="mt-2.5 text-center font-hand text-2xl leading-none text-text-muted">
                Life is a movie ☺
              </p>
            </div>
          </div>

          {/* 右：数据卡 + 手写感谢语 */}
          <div className="flex flex-col gap-4">
            <StatCard
              icon={<Youtube className="h-5 w-5" strokeWidth={1.5} />}
              label="发布作品"
              value={`${stats.totalWorks}`}
              caption="视频与图文专栏总数"
            />
            <StatCard
              icon={<Video className="h-5 w-5" strokeWidth={1.5} />}
              label="视频作品"
              value={`${stats.videoCount}`}
              caption="用镜头记录生活点滴"
            />
            <StatCard
              icon={<PencilLine className="h-5 w-5" strokeWidth={1.5} />}
              label="专栏文章"
              value={`${stats.articleCount}`}
              caption="用文字分享经验干货"
            />
            <p className="mt-1 -rotate-1 font-display text-base leading-loose text-text-secondary">
              感谢每一个关注、点赞、评论和支持
              <br />
              你们是我持续创作的动力
              <Heart className="ml-1 inline h-4 w-4 fill-berry text-berry align-[-2px]" strokeWidth={0} />
              <span className="mt-1 block h-1 w-40 rounded-full bg-accent/60" aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
