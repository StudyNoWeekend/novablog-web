"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera } from "lucide-react";
import { blogger, moduleConfig, ALL_ENABLED, type Blogger, type ModuleConfig } from "@/lib/api";
import { getSocialHref, getSocialIcon, getSocialLabel, isEmailLink } from "@/components/social-icon";
import themeInfo from "@/theme.json";

const NAV_ITEMS: { label: string; href: string; moduleKey?: keyof ModuleConfig }[] = [
  { label: "首页", href: "/" },
  { label: "作品", href: "/videos", moduleKey: "video_enabled" },
  { label: "关于我", href: "/about" },
  { label: "博客", href: "/articles", moduleKey: "article_enabled" },
  { label: "设备", href: "/gear", moduleKey: "equipment_enabled" },
  { label: "联系", href: "/contact" },
];

export function Footer() {
  const [info, setInfo] = useState<Blogger | null>(null);
  const [modules, setModules] = useState<ModuleConfig>(ALL_ENABLED);

  useEffect(() => {
    let cancelled = false;
    blogger.get().then((data) => {
      if (!cancelled) setInfo(data);
    }).catch(() => {});
    moduleConfig.get().then((config) => {
      if (!cancelled) setModules(config);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const navItems = NAV_ITEMS.filter((item) => !item.moduleKey || modules[item.moduleKey]);

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          {/* 品牌 */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              {info?.blog_icon ? (
                <Image
                  src={info.blog_icon}
                  alt={info.blog_title || "博客图标"}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg object-cover"
                  unoptimized
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Camera className="h-4 w-4" />
                </span>
              )}
              <span className="text-lg font-bold text-foreground">
                {info?.blog_title || "FrameWithMe"}
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {info?.blog_description || "用镜头，记录热爱的世界"}
            </p>
          </div>

          {/* 导航 */}
          <nav aria-label="页脚导航" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="cursor-pointer rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 社交 */}
          <div className="flex items-center gap-2">
            {(info?.social_links ?? []).map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a
                  key={link.platform + link.url}
                  href={getSocialHref(link)}
                  target={isEmailLink(link) ? undefined : "_blank"}
                  rel={isEmailLink(link) ? undefined : "noopener noreferrer"}
                  aria-label={getSocialLabel(link)}
                  title={getSocialLabel(link)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {info?.blog_title || info?.nickname || "FrameWithMe"}. All
            rights reserved.
          </p>
          {themeInfo.homepage && (
            <p>
              主题来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 inline-flex items-center gap-1 font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring rounded"
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
