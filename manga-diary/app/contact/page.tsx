"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, MessageCircleHeart } from "lucide-react";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { SocialIcons } from "@/components/SocialIcons";
import { CatFace, PawPrint } from "@/components/ComicDoodle";

/**
 * 留言页：博主联系方式 + 社交链接。
 * 后端评论接口仅支持挂在文章/攻略下，站内留言引导至创作动态文章评论区。
 */
export default function ContactPage() {
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

  return (
    <div className="flex flex-1 flex-col bg-background">
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-hand text-2xl text-accent-hover">Say Hi</p>
          <h1 className="mt-1 font-display text-4xl text-text-primary md:text-5xl">
            留言板
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            想对{nickname}说的话，可以通过这里送达
          </p>
        </div>
      </section>

      <section className="flex-1 py-14 sm:py-20">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-radius-lg border border-border bg-surface p-6 shadow-card sm:p-8">
            <CatFace className="absolute -top-6 left-1/2 h-12 w-12 -translate-x-1/2 text-ink" />

            <div className="mt-4 flex flex-col items-center text-center">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-ink">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={nickname}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-background-soft">
                    <CatFace className="h-9 w-9 text-text-subtle" />
                  </div>
                )}
              </div>
              <h2 className="mt-4 font-display text-xl text-text-primary">
                {nickname}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {profile?.blog_description || "用漫画记录生活"}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${profile?.email || ""}`}
                className="group flex cursor-pointer items-center gap-4 rounded-radius-md border border-border bg-background p-4 transition-all duration-200 ease-out hover:border-accent"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-text-muted">邮箱</p>
                  <p className="truncate text-sm font-medium text-text-primary transition-colors group-hover:text-accent-hover">
                    {profile?.email || "邮箱暂未公开，欢迎通过社交平台联系"}
                  </p>
                </div>
              </a>

              {profile?.city && (
                <div className="flex items-center gap-4 rounded-radius-md border border-border bg-background p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-xs text-text-muted">所在地</p>
                    <p className="text-sm font-medium text-text-primary">
                      {profile.city}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {profile?.social_links && profile.social_links.length > 0 && (
              <div className="mt-8">
                <h3 className="text-center text-sm font-medium text-text-primary">
                  社交媒体
                </h3>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <SocialIcons links={profile.social_links} size="lg" />
                </div>
              </div>
            )}

            {/* 引导去文章评论区留言 */}
            <Link
              href="/articles"
              className="group mt-8 flex cursor-pointer items-center gap-4 rounded-radius-md border border-dashed border-accent bg-accent-subtle p-4 transition-colors duration-200 hover:border-accent-hover"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-accent">
                <MessageCircleHeart className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  想在文章下面留言？
                </p>
                <p className="mt-0.5 text-xs text-text-muted transition-colors group-hover:text-accent-hover">
                  去创作动态挑一篇，评论区等你来盖楼
                  <PawPrint className="ml-1 inline h-3.5 w-3.5 -rotate-12 text-accent-hover" />
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
