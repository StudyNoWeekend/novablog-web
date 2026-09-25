"use client";

import { Mail } from "lucide-react";

interface SocialIconProps {
  platform: string;
  url: string;
  className?: string;
}

/**
 * 社交平台图标：lucide 覆盖的国际平台用图标，
 * B 站/微博/小红书等国内平台用单字徽章（与全仓库主题一致的处理方式）。
 */
export function SocialIcon({ platform, url, className }: SocialIconProps) {
  const p = platform.toLowerCase();
  const isMail = p === "email" || p === "mail";
  return (
    <a
      href={isMail ? `mailto:${url}` : url}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      aria-label={platform}
      className={
        className ??
        "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-sm font-medium text-text-muted transition-all duration-200 hover:border-accent hover:text-accent"
      }
    >
      {p === "bilibili" || p === "b站" ? (
        "B"
      ) : p === "weibo" || p === "微博" ? (
        "微"
      ) : p === "xiaohongshu" || p === "小红书" ? (
        "红"
      ) : p === "github" ? (
        "G"
      ) : p === "twitter" || p === "x" ? (
        "X"
      ) : p === "qq" ? (
        "Q"
      ) : p === "douban" || p === "豆瓣" ? (
        "豆"
      ) : isMail ? (
        <Mail className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <span className="text-xs font-bold uppercase">{platform.slice(0, 2)}</span>
      )}
    </a>
  );
}
