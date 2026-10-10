"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import type { ModuleConfig } from "@/lib/types";
import { apiFetch } from "@/lib/api/client";
import { ALL_MODULE_CONFIG, filterNavModules } from "@/components/nav-modules";
import { SocialIcons } from "@/components/SocialIcons";
import themeInfo from "@/theme.json";

interface FooterProps {
  profile: BloggerProfile | null;
}

/** 页脚尾部固定链接（全量模块链接之后） */
const FOOTER_TAIL_LINKS = [{ label: "关于我", href: "/about" }];

/** 页脚声波装饰线 */
function Waveform() {
  const bars = [3, 8, 14, 22, 30, 22, 14, 9, 16, 26, 18, 10, 5];
  return (
    <svg
      viewBox="0 0 140 32"
      className="mt-3 h-6 w-32 text-accent/70"
      aria-hidden="true"
    >
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 11}
          y={16 - h / 2}
          width="3"
          height={h}
          rx="1.5"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function Footer({ profile: serverProfile }: FooterProps) {
  const [profile, setProfile] = useState<BloggerProfile | null>(serverProfile);
  // 模块开关：取到前为 null（「更多」链接全量平铺），取到后按开关过滤
  const [modules, setModules] = useState<ModuleConfig | null>(null);
  const [email, setEmail] = useState("");

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

  const blogEmail = profile?.email || "";
  const year = new Date().getFullYear();

  // 订阅表单：组装一封邮件交给访客的邮件客户端（无后端订阅接口，不做假提交）
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogEmail) return;
    const addr = email.trim();
    const subject = encodeURIComponent("订阅你的音乐博客更新");
    const body = encodeURIComponent(
      `你好，我是 ${addr || "一位听众"}，希望在你的博客有新歌单/新文章更新时收到通知。`
    );
    window.location.href = `mailto:${blogEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <footer id="subscribe" className="scroll-mt-24 border-t border-border bg-background-soft">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:items-start">
          {/* Brand slogan */}
          <div>
            <p className="font-[var(--font-script)] text-3xl leading-tight text-text-primary">
              Good Music,
              <br />
              Better Life <span className="text-accent">♪</span>
            </p>
            <Waveform />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              {profile?.blog_description || ""}
            </p>
          </div>

          {/* Quick links：全量内容模块（超过 8 个用两列网格）+ 尾部固定链接 */}
          <nav aria-label="页脚导航" className="flex flex-col gap-3 self-center">
            <p className="text-sm font-semibold text-text-primary">快速导航</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
              {moduleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              {FOOTER_TAIL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Subscribe */}
          <div className="md:justify-self-end">
            {blogEmail ? (
              <>
                <p className="text-sm font-medium text-text-primary">订阅我的更新</p>
                <form onSubmit={handleSubscribe} className="mt-3 flex items-center">
                  <label htmlFor="footer-subscribe-email" className="sr-only">
                    你的邮箱
                  </label>
                  <input
                    id="footer-subscribe-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="输入你的邮箱"
                    className="h-11 w-48 rounded-l-full border border-r-0 border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none sm:w-56"
                  />
                  <button
                    type="submit"
                    aria-label="发送订阅邮件"
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-r-full bg-accent-strong text-on-accent transition-colors duration-200 hover:bg-accent-hover"
                  >
                    <Send className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </form>
                <p className="mt-2 text-xs text-text-subtle">
                  将通过邮件客户端发送订阅请求
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-text-primary">找到我</p>
                {profile?.social_links?.length ? (
                  <div className="mt-3">
                    <SocialIcons links={profile.social_links} size="lg" />
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-text-subtle">暂未配置联系方式</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-text-subtle md:flex-row">
          <p>
            © {year}
            {profile?.nickname ? ` ${profile.nickname}` : ""}
            {profile?.blog_description ? ` · ${profile.blog_description}` : ""}
          </p>
          {themeInfo.homepage && (
            <p>
              主题来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer transition-colors duration-200 hover:text-accent"
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
