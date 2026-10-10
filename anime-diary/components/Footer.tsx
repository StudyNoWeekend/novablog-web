"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Mail, MapPin } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import type { ModuleConfig } from "@/lib/types";
import { apiFetch } from "@/lib/api/client";
import { SocialIcon } from "@/components/SocialIcon";
import { ALL_MODULE_CONFIG, filterNavModules } from "@/components/nav-modules";
import themeInfo from "@/theme.json";

interface FooterProps {
  profile: BloggerProfile | null;
}

/** 页脚尾部固定链接（全量内容模块链接之后） */
const FOOTER_TAIL_LINKS = [
  { label: "关于我", href: "/about" },
  { label: "联系", href: "/contact" },
];

const FOOTER_SOCIAL_CLASS =
  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-night-soft text-sm font-medium text-white/70 transition-all duration-200 hover:border-accent hover:text-accent";

export function Footer({ profile: serverProfile }: FooterProps) {
  const [profile, setProfile] = useState<BloggerProfile | null>(serverProfile);
  // 模块开关：取到前为 null（链接全量平铺），取到后按开关过滤
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
        if (!cancelled) setModules({ ...ALL_MODULE_CONFIG, ...config });
      })
      .catch(() => {
        // 静默失败
      });
    return () => { cancelled = true; };
  }, []);

  // 全量内容模块链接（随模块开关过滤）+ 尾部固定链接
  const moduleLinks = filterNavModules(modules);

  const socialLinks = profile?.social_links?.length
    ? profile.social_links.map((s) => ({
        platform: s.name || s.platform,
        url: s.url,
      }))
    : [];

  return (
    <footer className="bg-night text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-10 md:items-start lg:flex-row">
          {/* Brand */}
          <div className="flex max-w-sm flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="flex cursor-pointer items-center gap-2 text-lg tracking-wide text-white transition-colors duration-200 ease-out hover:text-accent"
              >
                {profile?.blog_icon && (
                  <img
                    src={profile.blog_icon}
                    alt={profile.blog_title || ""}
                    className="h-7 w-7 rounded-full border border-accent/50 object-cover"
                  />
                )}
                <span className="font-heading">
                  {profile?.blog_title || ""}
                </span>
                <Heart className="h-3.5 w-3.5 fill-accent text-accent" strokeWidth={1.5} />
              </Link>
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white/60">
                v{themeInfo.version}
              </span>
            </div>
            <p className="text-sm text-white/60">
              —— {profile?.blog_description || "二次元，让生活更有趣"} ——
            </p>
          </div>

          {/* Quick links：全量内容模块 + 尾部固定链接（超过 8 个，两列网格） */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-white">快速导航</p>
            <nav
              aria-label="页脚导航"
              className="grid grid-cols-2 gap-x-10 gap-y-2"
            >
              {moduleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer text-sm text-white/70 transition-colors duration-200 ease-out hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              {FOOTER_TAIL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer text-sm text-white/70 transition-colors duration-200 ease-out hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Icons + contact info */}
          <div className="flex flex-col items-center gap-3 md:items-end">
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2.5">
                {socialLinks.map((link) => (
                  <SocialIcon
                    key={link.platform}
                    platform={link.platform}
                    url={link.url}
                    className={FOOTER_SOCIAL_CLASS}
                  />
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex cursor-pointer items-center gap-1 transition-colors duration-200 hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {profile.email}
                </a>
              )}
              {profile?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {profile.city}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {profile?.blog_title || ""}
            {" · "}记录热爱 · 分享美好
          </p>
          {themeInfo.homepage && (
            <p className="mt-1.5">
              主题来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 ease-out hover:text-accent"
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
