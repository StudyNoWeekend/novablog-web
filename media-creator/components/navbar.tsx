"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Camera, Menu, Search, X } from "lucide-react";
import { blogger, moduleConfig, ALL_ENABLED, type Blogger, type ModuleConfig } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSocialHref, getSocialIcon, getSocialLabel, isEmailLink } from "@/components/social-icon";

interface NavItem {
  label: string;
  href: string;
  moduleKey?: keyof ModuleConfig;
}

const NAV_ITEMS: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "作品", href: "/videos", moduleKey: "video_enabled" },
  { label: "关于我", href: "/about" },
  { label: "博客", href: "/articles", moduleKey: "article_enabled" },
  { label: "设备", href: "/gear", moduleKey: "equipment_enabled" },
  { label: "联系", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [info, setInfo] = useState<Blogger | null>(null);
  const [modules, setModules] = useState<ModuleConfig>(ALL_ENABLED);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let cancelled = false;
    // 客户端运行时获取博主信息与模块开关，覆盖构建期的回退值
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
  const socialLinks = (info?.social_links ?? []).slice(0, 4);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(q ? `/articles?keyword=${encodeURIComponent(q)}` : "/articles");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* 品牌：图标 + 双行标题 */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-xl px-1 py-1 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {info?.blog_icon ? (
              <Image
                src={info.blog_icon}
                alt={info.blog_title || "博客图标"}
                width={38}
                height={38}
                className="h-[38px] w-[38px] rounded-xl object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Camera className="h-5 w-5" />
              </span>
            )}
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-base font-bold text-foreground">
                {info?.blog_title || "FrameWithMe"}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {info?.blog_description || "用镜头，记录热爱的世界"}
              </span>
            </span>
          </Link>

          {/* 桌面端居中导航 */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* 右侧工具区 */}
          <div className="flex items-center gap-1">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-1 rounded-full border border-border bg-card pl-3 pr-1 py-1">
                  <input
                    autoFocus
                    type="search"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索文章…"
                    aria-label="搜索文章"
                    className="w-32 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="搜索"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="打开搜索"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Search className="h-[18px] w-[18px]" />
                </button>
              )}
            </form>

            <ThemeToggle />

            <div className="hidden md:flex items-center gap-1">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.platform + link.url}
                    href={getSocialHref(link)}
                    target={isEmailLink(link) ? undefined : "_blank"}
                    rel={isEmailLink(link) ? undefined : "noopener noreferrer"}
                    aria-label={getSocialLabel(link)}
                    title={getSocialLabel(link)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              className="lg:hidden inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 移动端菜单 */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <form onSubmit={handleSearch} className="mb-3 flex items-center gap-2 md:hidden">
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索文章…"
                aria-label="搜索文章"
                className="h-10 flex-1 rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="搜索"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`block cursor-pointer rounded-xl px-4 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive(item.href)
                    ? "bg-secondary text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 border-t border-border px-4 pt-3">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.platform + link.url}
                    href={getSocialHref(link)}
                    target={isEmailLink(link) ? undefined : "_blank"}
                    rel={isEmailLink(link) ? undefined : "noopener noreferrer"}
                    aria-label={getSocialLabel(link)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
