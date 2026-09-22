"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Mountain } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import { SocialIcons } from "@/components/SocialIcons";
import themeInfo from "@/theme.json";

const NAV_LINKS = [
  { label: "目的地", href: "/destinations" },
  { label: "游记", href: "/articles" },
  { label: "攻略", href: "/travels" },
  { label: "装备", href: "/gear" },
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
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="border-t border-border bg-background-soft">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="flex cursor-pointer items-center gap-2"
            >
              <Mountain className="h-5 w-5 text-accent" strokeWidth={1.8} />
              <span className="font-display text-lg text-text-primary">
                {profile?.blog_title || ""}
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {profile?.blog_description || ""}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-accent"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                  <span>{profile.email}</span>
                </a>
              )}
              {profile?.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  <span>{profile.city}</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-text-primary">快速导航</p>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer text-sm text-text-muted transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social + version */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-text-primary">找到我</p>
            {profile?.social_links && profile.social_links.length > 0 && (
              <SocialIcons links={profile.social_links} size="lg" />
            )}
            <span className="mt-1 w-fit rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-text-muted">
              v{themeInfo.version}
            </span>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-subtle">
          <p>
            © {new Date().getFullYear()} {profile?.blog_title || ""} · 用脚步丈量世界
          </p>
          {themeInfo.homepage && (
            <p className="mt-1">
              Theme：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-accent"
              >
                wanderlust-template
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
