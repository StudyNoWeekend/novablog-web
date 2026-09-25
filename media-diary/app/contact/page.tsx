import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, Heart, Mail, MapPin, Send } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SocialIcons } from "@/components/SocialIcons";
import { getBloggerProfile } from "@/lib/api/blogger";

export const metadata: Metadata = {
  title: "合作联系",
  description: "品牌合作、商务洽谈与朋友来信，欢迎联系博主",
};

/** 合作联系：合作说明 + 联系方式卡片 + 社交链接 */
export default async function ContactPage() {
  const profile = await getBloggerProfile();
  const blogTitle = profile?.blog_title || "多媒体日记";

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="合作联系"
        subtitle="品牌合作 · 商务洽谈 · 朋友来信，一起发现更多精彩"
      />

      <section className="flex-1 py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* 合作方向（对应 UI 图内容领域口吻） */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-xl bg-sky-soft p-6 text-center shadow-card">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-deep text-white">
                <Handshake className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h2 className="mt-4 font-display text-lg text-text-primary">品牌合作</h2>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                好物体验、植入共创、探店探访，视频与图文多形式承接
              </p>
            </div>
            <div className="rounded-xl bg-mint-soft p-6 text-center shadow-card">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-mint-deep text-white">
                <Send className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h2 className="mt-4 font-display text-lg text-text-primary">内容定制</h2>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                Vlog、测评、教程类内容定制，风格可按需求灵活调整
              </p>
            </div>
            <div className="rounded-xl bg-rose-soft p-6 text-center shadow-card">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-deep text-white">
                <Heart className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h2 className="mt-4 font-display text-lg text-text-primary">朋友来信</h2>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                任何想说的话都欢迎来信，看到都会认真回复
              </p>
            </div>
          </div>

          {/* 联系卡片 */}
          <div className="mt-10 rounded-xl border border-border bg-surface p-8 shadow-card md:p-10">
            <h2 className="text-center font-display text-2xl text-text-primary">
              联系方式
            </h2>
            <p className="mt-2 text-center text-sm text-text-muted">
              邮件说明来意最快，社交平台私信也可以找到我
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col gap-4">
              {profile?.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex min-h-14 cursor-pointer items-center gap-4 rounded-full border border-border bg-background-soft px-6 transition-colors duration-200 hover:border-accent"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent-hover">
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-text-subtle">邮箱</span>
                    <span className="block truncate text-sm font-medium text-text-primary">
                      {profile.email}
                    </span>
                  </span>
                </a>
              ) : null}
              {profile?.city && (
                <div className="flex min-h-14 items-center gap-4 rounded-full border border-border bg-background-soft px-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent-hover">
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-text-subtle">所在城市</span>
                    <span className="block truncate text-sm font-medium text-text-primary">
                      {profile.city}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* 社交链接 */}
            {profile?.social_links && profile.social_links.length > 0 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-sm font-medium text-text-secondary">
                  也可以在这些平台找到我
                </p>
                <SocialIcons links={profile.social_links} size="lg" />
              </div>
            )}

            <p className="mt-10 text-center font-display text-lg leading-loose text-text-secondary">
              期待与你一起，用内容连接更多热爱生活的人
              <span className="ml-1 inline-block h-1 w-24 rounded-full bg-accent/60 align-middle" aria-hidden="true" />
            </p>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-border bg-background-soft px-6 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
              >
                返回{blogTitle}首页
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
