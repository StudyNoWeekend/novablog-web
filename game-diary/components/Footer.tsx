"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, Mail, Send } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import themeInfo from "@/theme.json";

interface FooterProps {
  profile: BloggerProfile | null;
}

const FOOTER_QUOTE = "“好的游戏，值得被更多人看见。”";

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  const p = platform.toLowerCase();
  const isMail = p === "email" || p === "mail";
  return (
    <a
      href={isMail ? `mailto:${url}` : url}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      aria-label={platform}
      className="flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-text-muted transition-all duration-200 hover:border-accent hover:text-accent-hover"
    >
      {p === "bilibili" || p === "b站" || p === "bilibili站" ? (
        "B站"
      ) : p === "youtube" || p === "油管" ? (
        "YouTube"
      ) : p === "weibo" || p === "微博" ? (
        "微博"
      ) : p === "steam" ? (
        "Steam"
      ) : p === "douyin" || p === "抖音" ? (
        "抖音"
      ) : p === "xiaohongshu" || p === "小红书" ? (
        "小红书"
      ) : p === "email" || p === "mail" ? (
        <Mail className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <span className="max-w-20 truncate">{platform}</span>
      )}
    </a>
  );
}

export function Footer({ profile: serverProfile }: FooterProps) {
  const [profile, setProfile] = useState<BloggerProfile | null>(serverProfile);
  const [subscribeEmail, setSubscribeEmail] = useState("");

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

  const socialLinks =
    profile?.social_links?.map((s) => ({
      platform: s.name || s.platform,
      url: s.url,
    })) ?? [];

  // 订阅按钮：无后端订阅接口，通过邮件客户端向博主邮箱发送订阅请求
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const email = profile?.email;
    if (!email) return;
    const subject = encodeURIComponent("订阅博客更新");
    const body = encodeURIComponent(
      `你好，我希望使用 ${subscribeEmail.trim() || "我的邮箱"} 订阅「${
        profile?.blog_title || "你的博客"
      }」的内容更新通知。`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const hasSubscribe = Boolean(profile?.email);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background-soft">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Brand + quote */}
          <div className="flex flex-col justify-between gap-6">
            <Link
              href="/"
              className="flex w-fit cursor-pointer items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-theme shadow-glow">
                <Gamepad2 className="h-6 w-6 text-white" strokeWidth={1.8} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold tracking-wide text-text-primary">
                  {profile?.blog_title || ""}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-subtle">
                  Game · Share · Life
                </span>
              </span>
            </Link>
            <p className="font-heading text-base italic text-text-muted">
              {FOOTER_QUOTE}
            </p>
          </div>

          {/* Subscribe */}
          <div>
            <h2 className="mb-2 font-heading text-base font-bold text-text-primary">
              订阅我的更新
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-text-muted">
              {hasSubscribe
                ? "第一时间获取最新视频、文章和游戏动态！"
                : "通过下方友情链接关注我，获取最新动态！"}
            </p>
            {hasSubscribe && (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <label htmlFor="footer-subscribe-email" className="sr-only">
                  你的邮箱
                </label>
                <input
                  id="footer-subscribe-email"
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="输入你的邮箱"
                  className="min-h-11 w-full rounded-full border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-gradient-theme px-5 text-sm font-bold text-white shadow-glow transition-opacity duration-200 hover:opacity-90"
                >
                  <Send className="h-4 w-4" strokeWidth={1.8} />
                  订阅
                </button>
              </form>
            )}
          </div>

          {/* Friend links (social links from profile) */}
          <div>
            <h2 className="mb-4 font-heading text-base font-bold text-text-primary">
              友情链接
            </h2>
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((link) => (
                  <SocialIcon
                    key={`${link.platform}-${link.url}`}
                    platform={link.platform}
                    url={link.url}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-subtle">暂未配置社交链接</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-xs leading-relaxed text-text-subtle">
            © {year} {profile?.blog_title || ""} · 用游戏记录热爱
          </p>
          {themeInfo.homepage && (
            <p className="mt-2 text-center text-xs text-text-subtle">
              主题来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 ease-out hover:text-accent-hover"
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
