"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ALL_ENABLED_MODULE_CONFIG,
  blogger,
  getModuleConfig,
  Blogger,
  ModuleConfig,
} from "@/lib/api";
import { SocialIcon } from "@/components/social-icons";
import themeInfo from "@/theme.json";

interface FooterProps {
  /** 构建期传入的初始值；客户端运行时会重新获取并覆盖 */
  initialProfile: Blogger | null;
}

/** 页脚导航链接：带 moduleKey 的项随模块开关过滤（构建期兜底全开） */
const FOOTER_LINKS: { href: string; label: string; moduleKey?: keyof ModuleConfig }[] = [
  { href: "/", label: "首页" },
  { href: "/categories", label: "分类" },
  { href: "/tags", label: "标签" },
  { href: "/open-source", label: "开源作品", moduleKey: "open_source_enabled" },
  { href: "/recipes", label: "美食菜谱", moduleKey: "recipe_enabled" },
  { href: "/books", label: "读书书架", moduleKey: "book_enabled" },
  { href: "/games", label: "游戏库", moduleKey: "game_enabled" },
  { href: "/fitness", label: "健身训练", moduleKey: "fitness_enabled" },
  { href: "/tech-stack", label: "技术栈", moduleKey: "tech_stack_enabled" },
  { href: "/about", label: "关于我" },
];

export function Footer({ initialProfile }: FooterProps) {
  const [info, setInfo] = useState<Blogger | null>(initialProfile);
  const [modules, setModules] = useState<ModuleConfig>(ALL_ENABLED_MODULE_CONFIG);

  // 运行时重新获取博主资料与模块开关，覆盖构建期固化值（静态导出双保险）
  useEffect(() => {
    let cancelled = false;
    blogger
      .get()
      .then((data) => {
        if (!cancelled) setInfo(data);
      })
      .catch(() => {
        // 静默失败，保留构建时传入的值
      });
    getModuleConfig().then((config) => {
      if (!cancelled) setModules(config);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const socialLinks = [...(info?.social_links ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const footerLinks = FOOTER_LINKS.filter(
    (link) => !link.moduleKey || modules[link.moduleKey]
  );

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-mono text-lg font-semibold text-foreground">
              {info?.blog_title || "Tech Geek Blog"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {info?.blog_description || "记录代码与思考"}
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform + link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={link.name || link.platform}
                >
                  <SocialIcon link={link} className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          {themeInfo.homepage && (
            <p>
              主题来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                {themeInfo.name}（{themeInfo.id}）v{themeInfo.version}
              </a>
            </p>
          )}
          <nav className="flex flex-wrap items-center justify-center gap-4" aria-label="页脚导航">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
