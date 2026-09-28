"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChefHat,
  ChevronDown,
  Dumbbell,
  Gamepad2,
  GitFork,
  Layers,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialLinks } from "./social-links";
import {
  ALL_ENABLED_MODULE_CONFIG,
  getModuleConfig,
  type Blogger,
  type ModuleConfig,
} from "@/lib/api";

interface NavLink {
  number: string;
  label: string;
  href: string;
  /** 与 module-config 模块开关联动，关闭的模块导航项自动隐藏 */
  moduleKey?: keyof ModuleConfig;
}

interface MoreLink {
  label: string;
  href: string;
  moduleKey: keyof ModuleConfig;
  icon: LucideIcon;
}

const navLinks: NavLink[] = [
  { number: "01", label: "作品", href: "/" },
  { number: "02", label: "故事", href: "/portfolios", moduleKey: "portfolio_enabled" },
  { number: "03", label: "音乐", href: "/music", moduleKey: "music_enabled" },
  { number: "04", label: "日志", href: "/articles", moduleKey: "article_enabled" },
  { number: "05", label: "关于", href: "/#about" },
  { number: "06", label: "联系", href: "/#contact" },
];

/** 「更多」下拉组的六个子项，随各自模块开关过滤（六个全关时整个下拉不渲染） */
const MORE_LINKS: MoreLink[] = [
  { label: "开源作品", href: "/open-source", moduleKey: "open_source_enabled", icon: GitFork },
  { label: "美食菜谱", href: "/recipes", moduleKey: "recipe_enabled", icon: ChefHat },
  { label: "读书书架", href: "/books", moduleKey: "book_enabled", icon: BookOpen },
  { label: "游戏库", href: "/games", moduleKey: "game_enabled", icon: Gamepad2 },
  { label: "健身训练", href: "/fitness", moduleKey: "fitness_enabled", icon: Dumbbell },
  { label: "技术栈", href: "/tech-stack", moduleKey: "tech_stack_enabled", icon: Layers },
];

// lucide-react 1.x 已移除 Github 品牌图标，开源作品以 GitFork 呈现（与 tech-geek 样板一致）

interface NavbarProps {
  blogger: Blogger | null;
}

export function Navbar({ blogger }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modules, setModules] = useState<ModuleConfig>(ALL_ENABLED_MODULE_CONFIG);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 运行时获取模块开关配置（失败回退全开），构建期兜底值由 ALL_ENABLED_MODULE_CONFIG 提供
  useEffect(() => {
    let cancelled = false;
    getModuleConfig().then((config) => {
      if (!cancelled) setModules(config);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 路由跳转后自动关闭「更多」下拉
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

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

  const title = blogger?.blog_title?.trim() || "摄影作品集";
  const nickname = blogger?.nickname?.trim();
  const initial = (nickname || title || "摄").charAt(0).toUpperCase();
  const titleFirst = nickname || title;
  const titleSecond =
    nickname && blogger?.blog_title && blogger.blog_title !== nickname
      ? blogger.blog_title
      : "摄影日志";

  // 主导航项随模块开关过滤（关于/联系等固定项无 moduleKey，始终显示）
  const visibleNavLinks = navLinks.filter(
    (link) => !link.moduleKey || modules[link.moduleKey]
  );

  // 「更多」子项随模块开关过滤；六个全关时整个下拉组不渲染
  const moreLinks = MORE_LINKS.filter((link) => modules[link.moduleKey]);

  // 当前路径命中任一「更多」子项时触发器高亮
  const moreActive = moreLinks.some(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`)
  );

  // 「关于/联系」等固定项排在下拉组之后
  const mainLinks = visibleNavLinks.filter((link) => !["/#about", "/#contact"].includes(link.href));
  const fixedLinks = visibleNavLinks.filter((link) => ["/#about", "/#contact"].includes(link.href));

  const renderMoreRow = (link: MoreLink, isMobile = false) => {
    const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
    const Icon = link.icon;
    return (
      <Link
        key={link.href}
        href={link.href}
        role={isMobile ? undefined : "menuitem"}
        onClick={() => setMoreOpen(false)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-lg px-4 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isMobile && "px-3",
          active
            ? "text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className={cn(!isMobile && "tracking-wide")}>{link.label}</span>
      </Link>
    );
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300",
          isHome && !scrolled
            ? "border-white/10 bg-transparent"
            : "border-border bg-background/95 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex cursor-pointer items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-heading text-4xl font-light leading-none text-primary transition-colors group-hover:text-foreground">
              {initial}
            </span>
            <span className="hidden h-8 w-px bg-foreground/20 sm:block" />
            <div className="hidden flex-col sm:flex">
              <span className="font-heading text-sm tracking-[0.2em] text-foreground">
                {titleFirst}
              </span>
              <span className="font-heading text-[10px] tracking-[0.18em] text-muted-foreground">
                {titleSecond}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="主导航">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex cursor-pointer items-baseline gap-1.5 rounded-md py-1 text-xs font-medium tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-heading text-[10px] text-primary">
                  {link.number}
                </span>
                <span>{link.label}</span>
              </Link>
            ))}

            {/* 「更多」下拉组：末尾固定项（关于/联系）之前 */}
            {moreLinks.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  className={cn(
                    "flex cursor-pointer items-center gap-1 rounded-md py-1 text-xs font-medium tracking-[0.12em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    moreActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  更多
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      moreOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {moreOpen && (
                  <div
                    role="menu"
                    aria-label="更多页面菜单"
                    className="absolute right-0 top-full mt-3 w-44 rounded-xl border border-border bg-background/95 p-1.5 shadow-lg backdrop-blur-md"
                  >
                    {moreLinks.map((link) => renderMoreRow(link))}
                  </div>
                )}
              </div>
            )}

            {fixedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex cursor-pointer items-baseline gap-1.5 rounded-md py-1 text-xs font-medium tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-heading text-[10px] text-primary">
                  {link.number}
                </span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex">
            <SocialLinks
              links={blogger?.social_links}
              className="text-foreground/70"
            />
          </div>

          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 md:hidden",
            open ? "max-h-[calc(100vh-4rem)] overflow-y-auto opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-baseline gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-heading text-xs text-primary">
                  {link.number}
                </span>
                <span className="tracking-[0.08em]">{link.label}</span>
              </Link>
            ))}

            {/* 「更多功能」小节：以小标题 + 分隔线与主导航区分 */}
            {moreLinks.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  更多功能
                </p>
                <nav className="space-y-1" aria-label="更多功能导航">
                  {moreLinks.map((link) => renderMoreRow(link, true))}
                </nav>
              </div>
            )}

            <div className="pt-3">
              <SocialLinks links={blogger?.social_links} />
            </div>
          </div>
        </div>
      </header>
      <div className="h-16" />
    </>
  );
}
