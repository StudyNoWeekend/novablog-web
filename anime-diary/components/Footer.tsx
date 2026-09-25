"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Mail, MapPin } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import { SocialIcon } from "@/components/SocialIcon";
import themeInfo from "@/theme.json";

interface FooterProps {
  profile: BloggerProfile | null;
}

const DEFAULT_EMAIL = "";

const FOOTER_SOCIAL_CLASS =
  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-night-soft text-sm font-medium text-white/70 transition-all duration-200 hover:border-accent hover:text-accent";

export function Footer({ profile: serverProfile }: FooterProps) {
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

  const socialLinks = profile?.social_links?.length
    ? profile.social_links.map((s) => ({
        platform: s.name || s.platform,
        url: s.url,
      }))
    : [];

  const navLinks = [
    { label: "首页", href: "/" },
    { label: "动态", href: "/articles" },
    { label: "作品", href: "/portfolio" },
    { label: "音乐", href: "/music" },
    { label: "关于我", href: "/about" },
    { label: "联系", href: "/contact" },
  ];

  return (
    <footer className="bg-night text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 md:items-start">
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

          {/* Links */}
          <nav
            aria-label="页脚导航"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="cursor-pointer transition-colors duration-200 ease-out hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

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
              主题「{themeInfo.name}」来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 ease-out hover:text-accent"
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
