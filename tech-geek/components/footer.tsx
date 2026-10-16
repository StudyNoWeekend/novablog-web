"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, MapPin } from "lucide-react";
import { blogger, getModuleConfig, Blogger, ModuleConfig } from "@/lib/api";
import { SocialIcon } from "@/components/social-icons";
import { ALL_MODULE_CONFIG, filterNavModules } from "@/components/nav-modules";
import themeInfo from "@/theme.json";

interface FooterProps {
  /** 构建期传入的初始值；客户端运行时会重新获取并覆盖 */
  initialProfile: Blogger | null;
}

/** 页脚尾部固定链接（全量模块链接之后） */
const FOOTER_TAIL_LINKS = [{ label: "关于我", href: "/about" }];

export function Footer({ initialProfile }: FooterProps) {
  const [info, setInfo] = useState<Blogger | null>(initialProfile);
  const [modules, setModules] = useState<ModuleConfig>(ALL_MODULE_CONFIG);

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

  // 快速导航：全量内容模块链接（随模块开关过滤）+ 尾部固定链接
  const moduleLinks = filterNavModules(modules);
  const footerLinks = [...moduleLinks, ...FOOTER_TAIL_LINKS];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-16">
          {/* Brand + social */}
          <div className="max-w-sm text-center md:text-left">
            <p className="font-mono text-lg font-semibold text-foreground">
              {info?.blog_title || "Tech Geek Blog"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {info?.blog_description || "记录代码与思考"}
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-3 md:justify-start">
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

          {/* 快速导航：全量内容模块 + 尾部固定链接（固定两列网格，避免单列过长） */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">快速导航</p>
            <nav
              aria-label="页脚导航"
              className="grid grid-cols-2 gap-x-10 gap-y-2"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 联系方式：博主邮箱 / 城市（未配置时不渲染对应项） */}
          {(info?.email || info?.city) && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">联系我</p>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                {info?.email && (
                  <a
                    href={`mailto:${info.email}`}
                    className="flex w-fit items-center gap-1.5 rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {info.email}
                  </a>
                )}
                {info?.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {info.city}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
          {themeInfo.homepage && (
            <p className="text-center md:text-left">
              主题来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
