"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SocialLinks } from "./social-links";
import {
  ALL_ENABLED_MODULE_CONFIG,
  getModuleConfig,
  type Blogger,
  type ModuleConfig,
} from "@/lib/api";
import themeInfo from "@/theme.json";

interface FooterProps {
  blogger: Blogger | null;
}

/** 页脚扩展链接：带 moduleKey 的项随模块开关过滤（构建期兜底全开） */
const FOOTER_LINKS: { href: string; label: string; moduleKey: keyof ModuleConfig }[] = [
  { href: "/open-source", label: "开源作品", moduleKey: "open_source_enabled" },
  { href: "/recipes", label: "美食菜谱", moduleKey: "recipe_enabled" },
  { href: "/books", label: "读书书架", moduleKey: "book_enabled" },
  { href: "/games", label: "游戏库", moduleKey: "game_enabled" },
  { href: "/fitness", label: "健身训练", moduleKey: "fitness_enabled" },
  { href: "/tech-stack", label: "技术栈", moduleKey: "tech_stack_enabled" },
];

export function Footer({ blogger }: FooterProps) {
  const [modules, setModules] = useState<ModuleConfig>(ALL_ENABLED_MODULE_CONFIG);
  const title = blogger?.blog_title?.trim() || "摄影作品集";

  // 运行时重新获取模块开关，覆盖构建期兜底值（静态导出双保险，失败回退全开）
  useEffect(() => {
    let cancelled = false;
    getModuleConfig().then((config) => {
      if (!cancelled) setModules(config);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const footerLinks = FOOTER_LINKS.filter((link) => modules[link.moduleKey]);

  const emailLink = blogger?.social_links?.find((link) =>
    ["mail", "email"].includes(link.platform.toLowerCase())
  );
  const email = emailLink?.url?.replace(/^mailto:/i, "") || "";

  const socialLinks =
    blogger?.social_links?.filter(
      (link) => !["mail", "email"].includes(link.platform.toLowerCase())
    ) ?? [];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col items-center gap-8 text-center">
          <Link
            href="/#contact"
            className="group cursor-pointer rounded-md focus-visible:ring-2 focus-visible:ring-ring"
          >
            <h2 className="font-heading text-4xl font-light leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-5xl lg:text-6xl">
              让我们一起创造故事
            </h2>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {["编辑", "旅行", "纪实"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-4 py-1.5 text-sm tracking-wide text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="cursor-pointer rounded-md font-heading text-xl font-light tracking-wide text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:text-2xl"
              >
                {email}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">联系邮箱待设置</span>
            )}
            <span className="text-sm text-muted-foreground">{title}</span>
          </div>

          {socialLinks.length > 0 && <SocialLinks links={socialLinks} />}

          {footerLinks.length > 0 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4"
              aria-label="页脚导航"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer rounded-md text-xs tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {themeInfo.homepage && (
            <p className="pt-8 text-xs text-muted-foreground">
              主题来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-md transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
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
