"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChefHat,
  ChevronDown,
  Code2,
  Dumbbell,
  Gamepad2,
  GitFork,
  Layers,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { blogger, getModuleConfig, Blogger, ModuleConfig } from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  moduleKey?: keyof ModuleConfig;
  /** 移动端「更多功能」小节展示的图标 */
  icon?: LucideIcon;
}

/** 导航项与 module-config 模块开关联动，关闭的模块导航项自动隐藏 */
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/articles", label: "文章", moduleKey: "article_enabled" },
  { href: "/categories", label: "分类", moduleKey: "article_enabled" },
  { href: "/tags", label: "标签", moduleKey: "article_enabled" },
  { href: "/travels", label: "旅行", moduleKey: "travel_enabled" },
  { href: "/portfolio", label: "作品集", moduleKey: "portfolio_enabled" },
  { href: "/videos", label: "视频", moduleKey: "video_enabled" },
  { href: "/music", label: "音乐", moduleKey: "music_enabled" },
  { href: "/gear", label: "器材", moduleKey: "equipment_enabled" },
  { href: "/about", label: "关于我" },
];

/** 「更多」下拉组的六个子项，各带 moduleKey 随开关过滤（全关时整个下拉不渲染） */
const MORE_ITEMS: NavItem[] = [
  { href: "/open-source", label: "开源作品", moduleKey: "open_source_enabled", icon: GitFork },
  { href: "/recipes", label: "美食菜谱", moduleKey: "recipe_enabled", icon: ChefHat },
  { href: "/books", label: "读书书架", moduleKey: "book_enabled", icon: BookOpen },
  { href: "/games", label: "游戏库", moduleKey: "game_enabled", icon: Gamepad2 },
  { href: "/fitness", label: "健身训练", moduleKey: "fitness_enabled", icon: Dumbbell },
  { href: "/tech-stack", label: "技术栈", moduleKey: "tech_stack_enabled", icon: Layers },
];

interface NavbarProps {
  /** 构建期传入的初始值；客户端运行时会重新获取并覆盖 */
  initialModules: ModuleConfig;
  initialProfile: Blogger | null;
}

export function Navbar({ initialModules, initialProfile }: NavbarProps) {
  const pathname = usePathname();
  const [modules, setModules] = useState<ModuleConfig>(initialModules);
  const [profile, setProfile] = useState<Blogger | null>(initialProfile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // 运行时重新获取模块配置与博主资料，覆盖构建期固化值（静态导出双保险）
  useEffect(() => {
    let cancelled = false;
    getModuleConfig().then((config) => {
      if (!cancelled) setModules(config);
    });
    blogger
      .get()
      .then((data) => {
        if (cancelled || !data) return;
        setProfile(data);
        // 弥补静态导出下构建期后端不可达、元数据未写入的情况
        if (data.blog_title && !document.title.includes(data.blog_title)) {
          document.title = document.title
            ? `${document.title} | ${data.blog_title}`
            : data.blog_title;
        }
        if (data.blog_icon) {
          const link =
            document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
            (() => {
              const el = document.createElement("link");
              el.rel = "icon";
              document.head.appendChild(el);
              return el;
            })();
          if (!link.href.includes(data.blog_icon)) link.href = data.blog_icon;
        }
      })
      .catch(() => setProfile(initialProfile));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navItems = NAV_ITEMS.filter(
    (item) => !item.moduleKey || modules[item.moduleKey]
  );

  // 「更多」子项随模块开关过滤；六个全关时整个下拉组不渲染
  const moreItems = MORE_ITEMS.filter(
    (item) => !item.moduleKey || modules[item.moduleKey]
  );

  const renderNavLink = (item: NavItem, isMobile = false) => {
    const active =
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isMobile ? "flex items-center px-3 py-2.5" : "flex items-center px-2.5 py-2",
          active
            ? "text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {item.label}
        {active && (
          <span className="absolute inset-x-2.5 -bottom-[13px] hidden h-0.5 rounded-full bg-primary md:block" />
        )}
      </Link>
    );
  };

  // 「更多」子项渲染（桌面下拉与移动端小节共用，仅容器样式不同）
  const renderMoreLink = (item: NavItem, isMobile = false) => {
    const active =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        role={isMobile ? undefined : "menuitem"}
        onClick={() => setMoreOpen(false)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-md px-4 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isMobile && "px-3",
          active
            ? "text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
        {item.label}
      </Link>
    );
  };

  // 当前路径命中任一「更多」子项时触发器高亮
  const moreActive = moreItems.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

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

  // 「关于我」等固定项排在下拉组之后
  const mainItems = navItems.filter((item) => item.href !== "/about");
  const aboutItems = navItems.filter((item) => item.href === "/about");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {profile?.blog_icon ? (
            <Image
              src={profile.blog_icon}
              alt={profile.blog_title || "logo"}
              width={28}
              height={28}
              className="h-7 w-7 rounded object-cover"
              unoptimized
            />
          ) : (
            <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />
          )}
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            {profile?.blog_title || "Tech Geek"}
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="主导航">
          {mainItems.map((item) => renderNavLink(item))}

          {/* 「更多」下拉组：末尾固定项（关于我）之前 */}
          {moreItems.length > 0 && (
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                aria-label="更多页面"
                className={cn(
                  "flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  moreActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  <span className="absolute inset-x-2.5 -bottom-[13px] hidden h-0.5 rounded-full bg-primary md:block" />
                )}
              </button>

              {moreOpen && (
                <div
                  role="menu"
                  aria-label="更多页面菜单"
                  className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-border bg-background/95 p-1.5 shadow-lg backdrop-blur"
                >
                  {moreItems.map((item) => renderMoreLink(item))}
                </div>
              )}
            </div>
          )}

          {aboutItems.map((item) => renderNavLink(item))}
        </nav>

        {/* 桌面端右侧留白，移动端显示汉堡菜单 */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto cursor-pointer text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            <nav className="space-y-1" aria-label="移动端导航">
              {navItems.map((item) => renderNavLink(item, true))}
            </nav>

            {/* 「更多功能」小节：以小标题 + 分隔线与主导航区分 */}
            {moreItems.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  更多功能
                </p>
                <nav className="space-y-1" aria-label="更多功能导航">
                  {moreItems.map((item) => renderMoreLink(item, true))}
                </nav>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
