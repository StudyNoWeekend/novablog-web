"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChefHat, Heart } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import { SocialIcons } from "@/components/SocialIcons";
import themeInfo from "@/theme.json";

const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "美食日记", href: "/articles" },
  { label: "菜谱分享", href: "/recipes" },
  { label: "旅行美食", href: "/travels" },
  { label: "关于我", href: "/about" },
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
    <footer className="bg-cocoa text-[#efe4d6]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="flex cursor-pointer items-center gap-2.5">
              {profile?.blog_icon ? (
                <img
                  src={profile.blog_icon}
                  alt={profile.blog_title || ""}
                  className="h-9 w-9 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-accent">
                  <ChefHat className="h-5 w-5" strokeWidth={1.6} />
                </span>
              )}
              <span className="flex flex-col">
                <span className="font-display text-lg leading-tight text-white">
                  {profile?.blog_title || "美食日记"}
                </span>
                {profile?.blog_description && (
                  <span className="text-[11px] leading-tight text-white/50">
                    — {profile.blog_description} —
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
            <p className="text-sm font-semibold text-white/85">快速导航</p>
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
            <p className="flex items-center gap-1.5 text-sm font-semibold text-white/85">
              关注我，一起发现更多美味
              <Heart className="h-3.5 w-3.5 fill-berry text-berry" strokeWidth={0} />
            </p>
            {profile?.social_links && profile.social_links.length > 0 ? (
              <div className="[&_a]:text-white/60 [&_a:hover]:text-white">
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
            © {new Date().getFullYear()} {profile?.blog_title || "美食日记"}
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
