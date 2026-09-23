"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Heart, Menu, Search, X } from "lucide-react";
import type { ModuleConfig } from "@/lib/types";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";

interface NavItem {
  label: string;
  href: string;
  moduleKey?: keyof ModuleConfig;
}

const NAV_ITEMS: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "视频", href: "/videos", moduleKey: "video_enabled" },
  { label: "文章", href: "/articles", moduleKey: "article_enabled" },
  { label: "游戏库", href: "/games", moduleKey: "equipment_enabled" },
  { label: "关于我", href: "/about" },
];

const ALL_ENABLED: ModuleConfig = {
  article_enabled: true,
  media_enabled: true,
  music_enabled: true,
  video_enabled: true,
  travel_enabled: true,
  portfolio_enabled: true,
  equipment_enabled: true,
  updated_at: "",
};

interface NavbarProps {
  modules: ModuleConfig;
}

export function Navbar({ modules: _modules }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [runtimeModules, setRuntimeModules] = useState<ModuleConfig | null>(null);
  const [profile, setProfile] = useState<BloggerProfile | null>(null);

  // 客户端运行时重新获取模块配置，覆盖构建时传入的 "全部启用" 默认值
  useEffect(() => {
    let cancelled = false;
    apiFetch<ModuleConfig>("/public/module-config")
      .then((config) => {
        if (!cancelled) {
          setRuntimeModules({ ...ALL_ENABLED, ...config });
        }
      })
      .catch(() => {
        // 静默失败，保留构建时传入的值
      });
    return () => { cancelled = true; };
  }, []);

  // 客户端获取博主资料
  useEffect(() => {
    let cancelled = false;
    apiFetch<BloggerProfile>("/public/blogger")
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          // 弥补静态导出下构建期后端不可达、blog_title 未写入 <title> 的情况；
          // 若构建期已生成（标题已包含 blog_title）则不做覆盖
          if (data?.blog_title && !document.title.includes(data.blog_title)) {
            document.title = document.title
              ? `${document.title} | ${data.blog_title}`
              : data.blog_title;
          }
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // 优先使用运行时获取的配置，降级到构建时 prop
  const modules = runtimeModules ?? _modules;

  const navItems = NAV_ITEMS.filter(
    (item) => !item.moduleKey || modules[item.moduleKey]
  );

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex shrink-0 cursor-pointer items-center gap-3"
            onClick={closeMenu}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-theme shadow-glow transition-transform duration-200 ease-out group-hover:scale-105">
              <Gamepad2 className="h-6 w-6 text-white" strokeWidth={1.8} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="max-w-[11rem] truncate text-lg font-extrabold tracking-wide text-text-primary">
                {profile?.blog_title || ""}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-subtle">
                Game · Share · Life
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative cursor-pointer px-3.5 py-3 text-sm font-semibold transition-colors duration-200 ease-out ${
                  isActive(item.href)
                    ? "text-accent-hover"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-theme" />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/articles"
              aria-label="搜索文章"
              className="hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-200 ease-out hover:bg-surface hover:text-text-primary sm:flex"
            >
              <Search className="h-5 w-5" strokeWidth={1.8} />
            </Link>
            <Link
              href="/about"
              className="hidden cursor-pointer items-center gap-1.5 rounded-full bg-gradient-theme px-5 py-2.5 text-sm font-bold text-white shadow-glow transition-all duration-200 ease-out hover:opacity-90 sm:flex"
            >
              <Heart className="h-4 w-4 fill-current" strokeWidth={1.8} />
              关注我
            </Link>
            <button
              type="button"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 ease-out hover:bg-surface hover:text-text-primary lg:hidden"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.8} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.8} />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`overflow-hidden border-t border-border bg-background transition-all duration-300 ease-out lg:hidden ${
            isMenuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`cursor-pointer rounded-lg px-3 py-3 text-base font-semibold transition-colors duration-200 ease-out ${
                  isActive(item.href)
                    ? "bg-accent-subtle text-accent-hover"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/articles"
              onClick={closeMenu}
              className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-theme px-3 py-3 text-base font-bold text-white"
            >
              <Heart className="h-4 w-4 fill-current" strokeWidth={1.8} />
              关注我
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-18" />
    </>
  );
}
