"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Camera,
  ChefHat,
  ChevronDown,
  Dumbbell,
  Gamepad2,
  GitFork,
  Layers,
  Menu,
  Search,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { blogger, moduleConfig, ALL_ENABLED, type Blogger, type ModuleConfig } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSocialHref, getSocialIcon, getSocialLabel, isEmailLink } from "@/components/social-icon";

interface NavItem {
  label: string;
  href: string;
  moduleKey?: keyof ModuleConfig;
  /** 移动端「更多功能」小节与桌面下拉展示的图标 */
  icon?: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "作品", href: "/videos", moduleKey: "video_enabled" },
  { label: "音乐", href: "/music", moduleKey: "music_enabled" },
  { label: "关于我", href: "/about" },
  { label: "博客", href: "/articles", moduleKey: "article_enabled" },
  { label: "设备", href: "/gear", moduleKey: "equipment_enabled" },
  { label: "联系", href: "/contact" },
];

/** 「更多」下拉组的六个子项，各带 moduleKey 随开关过滤（全关时整个下拉不渲染） */
const MORE_ITEMS: NavItem[] = [
  { label: "开源作品", href: "/open-source", moduleKey: "open_source_enabled", icon: GitFork },
  { label: "美食菜谱", href: "/recipes", moduleKey: "recipe_enabled", icon: ChefHat },
  { label: "读书书架", href: "/books", moduleKey: "book_enabled", icon: BookOpen },
  { label: "游戏库", href: "/games", moduleKey: "game_enabled", icon: Gamepad2 },
  { label: "健身训练", href: "/fitness", moduleKey: "fitness_enabled", icon: Dumbbell },
  { label: "技术栈", href: "/tech-stack", moduleKey: "tech_stack_enabled", icon: Layers },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [info, setInfo] = useState<Blogger | null>(null);
  const [modules, setModules] = useState<ModuleConfig>(ALL_ENABLED);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
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

  // 「更多」子项随模块开关过滤；六个全关时整个下拉组不渲染
  const moreItems = MORE_ITEMS.filter((item) => !item.moduleKey || modules[item.moduleKey]);

  // 「联系」等固定项排在下拉组之后
  const mainItems = navItems.filter((item) => item.href !== "/contact");
  const fixedItems = navItems.filter((item) => item.href === "/contact");

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  // 当前路径命中任一「更多」子项时触发器高亮
  const moreActive = moreItems.some((item) => isActive(item.href));

  // 点击面板外部 / Escape 关闭「更多」下拉
  useEffect(() => {
    if (!moreOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [moreOpen]);

  // 路由跳转后自动关闭「更多」下拉
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(q ? `/articles?keyword=${encodeURIComponent(q)}` : "/articles");
  };

  // 「更多」子项渲染（桌面下拉与移动端小节共用，仅容器样式不同）
  const renderMoreLink = (item: NavItem, isMobile = false) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        role={isMobile ? undefined : "menuitem"}
        onClick={() => {
          setMoreOpen(false);
          setMobileOpen(false);
        }}
        aria-current={isActive(item.href) ? "page" : undefined}
        className={cn(
          "flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-xl px-4 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isMobile && "py-3 text-base font-medium",
          isActive(item.href)
            ? isMobile
              ? "bg-secondary text-primary"
              : "text-primary"
            : isMobile
              ? "text-foreground hover:bg-muted"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
        {item.label}
      </Link>
    );
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
            {mainItems.map((item) => (
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

            {/* 「更多」下拉组：主导航末尾固定项（联系）之前 */}
            {moreItems.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  aria-label="更多页面"
                  className={cn(
                    "relative flex cursor-pointer items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    moreActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  更多
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      moreOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                  {moreActive && (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  )}
                </button>

                {moreOpen && (
                  <div
                    role="menu"
                    aria-label="更多页面菜单"
                    className="absolute right-0 top-full mt-3 w-44 rounded-2xl border border-border bg-background/95 p-1.5 shadow-xl backdrop-blur-md"
                  >
                    {moreItems.map((item) => renderMoreLink(item))}
                  </div>
                )}
              </div>
            )}

            {fixedItems.map((item) => (
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

            {/* 「更多功能」小节：以小标题 + 分隔线与主导航区分 */}
            {moreItems.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="px-4 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  更多功能
                </p>
                <nav className="space-y-1" aria-label="更多功能导航">
                  {moreItems.map((item) => renderMoreLink(item, true))}
                </nav>
              </div>
            )}

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
