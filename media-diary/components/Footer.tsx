"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import type { ModuleConfig } from "@/lib/types";
import { apiFetch } from "@/lib/api/client";
import { SocialIcons } from "@/components/SocialIcons";
import { filterMoreItems } from "@/components/more-nav-items";
import themeInfo from "@/theme.json";

const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "关于我", href: "/about" },
  { label: "作品展示", href: "/works" },
  { label: "内容专栏", href: "/articles" },
  { label: "音乐", href: "/music" },
  { label: "合作联系", href: "/contact" },
];

const ALL_ENABLED: ModuleConfig = {
  article_enabled: true,
  media_enabled: true,
  music_enabled: true,
  video_enabled: true,
  travel_enabled: true,
  portfolio_enabled: true,
  equipment_enabled: true,
  open_source_enabled: true,
  recipe_enabled: true,
  book_enabled: true,
  game_enabled: true,
  fitness_enabled: true,
  tech_stack_enabled: true,
  updated_at: "",
};

export function Footer({ profile: serverProfile }: { profile: BloggerProfile | null }) {
  const [profile, setProfile] = useState<BloggerProfile | null>(serverProfile);
  // 模块开关：取到前为 null（「更多功能」链接全量平铺），取到后按开关过滤
  const [modules, setModules] = useState<ModuleConfig | null>(null);

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

  // 客户端获取模块开关配置（失败时保持 null，链接全量平铺展示）
  useEffect(() => {
    let cancelled = false;
    apiFetch<ModuleConfig>("/public/module-config")
      .then((config) => {
        if (!cancelled) setModules({ ...ALL_ENABLED, ...config });
      })
      .catch(() => {
        // 静默失败
      });
    return () => { cancelled = true; };
  }, []);

  const moreFooterItems = filterMoreItems(modules);

  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand（对应 UI 图页脚品牌区） */}
          <div className="max-w-sm">
            <Link href="/" className="flex cursor-pointer items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-ink">
                <Play className="h-4.5 w-4.5 translate-x-px fill-current" strokeWidth={0} />
              </span>
              <span className="flex flex-col">
                <span className="font-display text-lg leading-tight text-white">
                  {profile?.blog_title || "多媒体日记"}
                </span>
                {profile?.blog_description && (
                  <span className="text-[11px] leading-tight text-white/50">
                    {profile.blog_description}
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

          {/* Social + 手写标语（对应 UI 图页脚右下角「一起把生活拍成电影」） */}
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-white/85">
              关注我，一起发现更多精彩
              <Heart className="h-3.5 w-3.5 fill-berry text-berry" strokeWidth={0} />
            </p>
            {profile?.social_links && profile.social_links.length > 0 ? (
              <SocialIcons links={profile.social_links} size="lg" variant="dark" />
            ) : (
              <p className="text-sm text-white/40">期待与你相遇</p>
            )}
            <p className="mt-1 font-hand text-xl leading-snug text-accent">
              一起把生活
              <br />
              拍成电影 ♡
            </p>
            <span className="w-fit rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] tracking-wide text-white/45">
              {themeInfo.name} v{themeInfo.version}
            </span>
          </div>
        </div>

        {/* 「更多功能」链接：随模块开关过滤 */}
        {moreFooterItems.length > 0 && (
          <nav
            aria-label="更多功能"
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-6"
          >
            {moreFooterItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-white/55 transition-colors duration-200 ease-out hover:text-accent"
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Copyright + 主题来源链接 */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          <p>
            © {new Date().getFullYear()} {profile?.blog_title || "多媒体日记"}
            {profile?.blog_description ? ` · ${profile.blog_description}` : ""}
          </p>
          {themeInfo.homepage && (
            <p className="mt-1.5">
              主题来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-white/65 underline decoration-white/25 underline-offset-2 transition-colors duration-200 hover:text-accent"
              >
                {themeInfo.name}（{themeInfo.id}）v{themeInfo.version}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
