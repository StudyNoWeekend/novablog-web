"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CatFace, PawPrint } from "@/components/ComicDoodle";
import { SocialIcons } from "@/components/SocialIcons";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import themeInfo from "@/theme.json";

const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "作品", href: "/portfolio" },
  { label: "动态", href: "/articles" },
  { label: "音乐", href: "/music" },
  { label: "关于我", href: "/about" },
  { label: "留言", href: "/contact" },
];

export function Footer({ profile: serverProfile }: { profile: BloggerProfile | null }) {
  const [profile, setProfile] = useState<BloggerProfile | null>(serverProfile);

  // 客户端运行时重新获取博主资料，覆盖静态导出下服务端获取为 null 的问题
  useEffect(() => {
    let cancelled = false;
    apiFetch<BloggerProfile>("/public/blogger")
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        // 静默失败，保留服务端传入的值
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <footer className="bg-ink text-[#f3efe4]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="flex cursor-pointer items-center gap-2.5">
              {profile?.blog_icon ? (
                <img
                  src={profile.blog_icon}
                  alt={profile.blog_title || ""}
                  className="h-10 w-10 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <CatFace className="h-10 w-10 text-accent" />
              )}
              <span className="flex flex-col">
                <span className="font-display text-xl leading-tight text-white">
                  {profile?.blog_title || "漫画日记"}
                </span>
                {profile?.blog_description && (
                  <span className="text-[11px] tracking-[0.18em] text-white/50">
                    — 用漫画记录生活 —
                  </span>
                )}
              </span>
            </Link>
            {profile?.bio && (
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/55">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Quick links */}
          <nav aria-label="页脚导航" className="flex flex-col gap-2.5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-white/85">
              <PawPrint className="h-4 w-4 text-accent" />
              快速导航
            </p>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer text-sm text-white/55 transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-white/85">
              喜欢漫画，也喜欢你们
            </p>
            {profile?.social_links && profile.social_links.length > 0 ? (
              <div className="[&_a]:border-white/20 [&_a]:bg-white/5 [&_a]:text-white/60 [&_a:hover]:border-accent [&_a:hover]:bg-accent [&_a:hover]:text-ink">
                <SocialIcons links={profile.social_links} size="lg" />
              </div>
            ) : (
              <p className="text-sm text-white/40">期待与你相遇</p>
            )}
            <span className="mt-1 w-fit rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] tracking-wide text-white/45">
              {themeInfo.name} v{themeInfo.version}
            </span>
          </div>
        </div>

        {/* Copyright + 主题来源链接 */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          <p>
            © {new Date().getFullYear()} {profile?.blog_title || "漫画日记"}
            {profile?.blog_description ? ` · ${profile.blog_description}` : ""}
          </p>
          {themeInfo.homepage && (
            <p className="mt-1.5">
              主题「{themeInfo.name}」来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-white/65 underline decoration-white/25 underline-offset-2 transition-colors duration-200 hover:text-accent"
              >
                {themeInfo.homepage}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
