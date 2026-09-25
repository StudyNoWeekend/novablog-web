"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Mail } from "lucide-react";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { SocialIcon } from "@/components/SocialIcon";

export function ContactContent() {
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

  const socialLinks = profile?.social_links ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      {/* 邮箱卡片 */}
      {profile?.email && (
        <a
          href={`mailto:${profile.email}`}
          className="group flex cursor-pointer items-center gap-5 rounded-radius-lg border border-accent/25 bg-gradient-to-br from-accent-subtle to-transparent p-6 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <Mail className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-lg text-text-primary">
              邮件联系
            </span>
            <span className="mt-0.5 block truncate text-sm text-text-muted">
              {profile.email}
            </span>
          </span>
          <ArrowUpRight
            className="h-5 w-5 shrink-0 text-text-subtle transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            strokeWidth={1.5}
          />
        </a>
      )}

      {/* 社交平台 */}
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-xl text-text-primary">
          <Heart className="h-5 w-5 fill-accent text-accent" strokeWidth={1.5} />
          找到我
        </h2>
        {socialLinks.length === 0 ? (
          <div className="rounded-radius-md border border-dashed border-border py-14 text-center">
            <Heart className="mx-auto h-9 w-9 text-text-subtle" strokeWidth={1.5} />
            <p className="mt-3 font-heading text-text-muted">
              博主还没有留下社交账号，可以通过邮件联系～
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {socialLinks.map((link) => {
              const name = link.name || link.platform;
              const p = link.platform.toLowerCase();
              const isMail = p === "email" || p === "mail";
              return (
                <a
                  key={`${link.platform}-${link.url}`}
                  href={isMail ? `mailto:${link.url}` : link.url}
                  target={isMail ? undefined : "_blank"}
                  rel={isMail ? undefined : "noopener noreferrer"}
                  className="group flex cursor-pointer items-center gap-4 rounded-radius-md border border-border bg-surface p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
                >
                  <SocialIcon
                    platform={name}
                    url={link.url}
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-accent/25 bg-accent-subtle text-sm font-medium text-accent-hover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-text-primary">
                      {name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-text-muted">
                      {link.url}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-text-subtle transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    strokeWidth={1.5}
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* 留言引导 */}
      <div className="mt-10 rounded-radius-lg bg-gradient-to-br from-lav-subtle via-accent-subtle to-sky-subtle p-8 text-center">
        <p className="font-heading text-xl text-text-primary">
          一起把喜欢的东西，变成更有意义的生活吧
        </p>
        <p className="mt-2 text-sm text-text-muted">
          想聊天、约稿或者单纯打个招呼，都欢迎随时联系我
        </p>
      </div>
    </div>
  );
}
