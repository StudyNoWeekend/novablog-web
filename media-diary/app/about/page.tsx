import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Crown, Mail, MapPin, Smile } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SocialIcons } from "@/components/SocialIcons";
import { getBloggerProfile } from "@/lib/api/blogger";

export const metadata: Metadata = {
  title: "关于我",
  description: "关于博主：一个热爱生活的多媒体内容创作者",
};

const DEFAULT_BIO =
  "我热爱用镜头和文字记录生活中的美好瞬间，也喜欢把有用的知识、真实的体验和有趣的想法分享给大家。希望通过我的内容，能让你在忙碌的生活中，找到一点共鸣、一点灵感和一点快乐。";

/** 关于我：拍立得头像 + 介绍 + 标签 + 社交链接（对应 UI 图 About 区块的完整版） */
export default async function AboutPage() {
  const profile = await getBloggerProfile();
  const tags = profile?.tags?.filter(Boolean) ?? [
    "摄影",
    "剪辑",
    "写作",
    "旅行",
    "数码",
    "生活方式",
  ];

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader title="关于我" subtitle="很高兴认识你，欢迎来到我的多媒体日记" />

      <section className="flex-1 py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[auto_1fr] md:gap-16">
            {/* 拍立得头像 */}
            <div className="relative mx-auto w-fit">
              <p
                aria-hidden="true"
                className="absolute -right-8 -top-10 z-10 hidden -rotate-12 flex-col items-start font-display text-2xl leading-relaxed text-text-secondary lg:flex"
              >
                <span>欢迎来</span>
                <span>认识我</span>
                <Smile className="ml-8 mt-1 h-6 w-6 text-accent" strokeWidth={1.5} />
              </p>
              <div className="polaroid w-60 -rotate-2 sm:w-72">
                <span className="tape" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-background-soft">
                  {profile?.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile?.nickname || "博主头像"}
                      fill
                      sizes="288px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-6xl text-text-subtle">
                      {profile?.nickname?.slice(0, 1) || "Hi"}
                    </div>
                  )}
                </div>
                <p className="mt-2.5 text-center font-hand text-2xl leading-none text-text-muted">
                  Life is a movie ☺
                </p>
              </div>
            </div>

            {/* 介绍 */}
            <div>
              <p className="flex items-center gap-2 font-hand text-2xl text-text-muted">
                About Me
                <Crown className="h-5 w-5 text-accent" strokeWidth={1.5} />
              </p>
              <h2 className="mt-2 font-display text-3xl leading-snug text-text-primary md:text-4xl">
                我是{profile?.nickname || "多媒体创作者"}
                <span
                  className="squiggle ml-1 inline-block h-1 w-16 align-middle"
                  aria-hidden="true"
                />
              </h2>
              <p className="mt-3 text-sm font-medium text-text-secondary md:text-base">
                {profile?.blog_description ||
                  "全网多媒体内容创作者 | 生活记录者 | 视觉爱好者"}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-loose text-text-muted md:text-base">
                {profile?.bio || DEFAULT_BIO}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-text-secondary shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 联系方式 */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-text-secondary">
                {profile?.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-accent-hover" strokeWidth={1.5} />
                    {profile.city}
                  </span>
                )}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-accent-hover"
                  >
                    <Mail className="h-4 w-4 text-accent-hover" strokeWidth={1.5} />
                    {profile.email}
                  </a>
                )}
              </div>

              {/* 社交链接 */}
              {profile?.social_links && profile.social_links.length > 0 && (
                <div className="mt-6 flex items-center gap-3">
                  <SocialIcons links={profile.social_links} size="lg" />
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/works"
                  className="inline-flex min-h-12 cursor-pointer items-center rounded-full bg-accent px-7 text-sm font-semibold text-ink shadow-card transition-all duration-300 ease-out hover:bg-accent-hover hover:shadow-card-hover"
                >
                  看看我的作品
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 cursor-pointer items-center rounded-full border border-border bg-surface px-7 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                >
                  与我合作
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
