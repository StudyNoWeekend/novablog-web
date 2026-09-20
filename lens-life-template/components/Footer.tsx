"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import themeInfo from "@/theme.json";

interface FooterProps {
  profile: BloggerProfile | null;
}

const DEFAULT_EMAIL = "";

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  const p = platform.toLowerCase();
  const isMail = p === "email" || p === "mail";
  return (
    <a
      href={isMail ? `mailto:${url}` : url}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      aria-label={platform}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-sm font-medium text-text-muted transition-all duration-200 hover:border-accent hover:text-accent"
    >
      {p === "instagram" ? (
        <Instagram className="h-4 w-4" strokeWidth={1.5} />
      ) : p === "weibo" || p === "微博" ? (
        "微"
      ) : p === "bilibili" || p === "b站" ? (
        "B"
      ) : p === "xiaohongshu" || p === "小红书" ? (
        "红"
      ) : (
        <span className="text-xs font-bold uppercase">{platform.slice(0, 2)}</span>
      )}
    </a>
  );
}

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

  return (
    <footer className="border-t border-border bg-background-soft">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="flex cursor-pointer items-center gap-2 text-lg font-medium tracking-wide text-text-primary transition-colors duration-200 ease-out hover:text-accent"
              >
                {profile?.blog_icon && (
                  <img
                    src={profile.blog_icon}
                    alt={profile.blog_title || ""}
                    className="h-6 w-6 rounded object-cover"
                  />
                )}
                <span className="font-[var(--font-playfair)] italic">
                  {profile?.blog_title || ""}
                </span>
              </Link>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium tracking-wide text-text-muted">
                v{themeInfo.version}
              </span>
            </div>
            <p className="text-sm text-text-muted">
              {profile?.blog_description || ""}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted">
            <a
              href={`mailto:${profile?.email || DEFAULT_EMAIL}`}
              className="flex cursor-pointer items-center gap-1.5 transition-colors duration-200 ease-out hover:text-text-primary"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              <span>{profile?.email || DEFAULT_EMAIL}</span>
            </a>
            {profile?.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                <span>{profile.city}</span>
              </span>
            )}
          </div>

          {/* Social Icons — only from profile */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <SocialIcon
                  key={link.platform}
                  platform={link.platform}
                  url={link.url}
                />
              ))}
            </div>
          )}
        </div>

        {themeInfo.homepage && (
          <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-subtle">
            <p>
              来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 ease-out hover:text-accent"
              >
                {themeInfo.homepage}
              </a>
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}