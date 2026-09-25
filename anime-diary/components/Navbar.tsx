"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
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
  { label: "动态", href: "/articles", moduleKey: "article_enabled" },
  { label: "作品", href: "/portfolio", moduleKey: "portfolio_enabled" },
  { label: "音乐", href: "/music", moduleKey: "music_enabled" },
  { label: "关于我", href: "/about" },
  { label: "联系", href: "/contact" },
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

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-night/90 backdrop-blur-md">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="group flex shrink-0 cursor-pointer items-center gap-2 text-lg tracking-wide text-white transition-colors duration-200 ease-out hover:text-accent"
              onClick={closeMenu}
            >
              {profile?.blog_icon && (
                <img
                  src={profile.blog_icon}
                  alt={profile.blog_title || ""}
                  className="h-8 w-8 rounded-full border border-accent/50 object-cover"
                />
              )}
              {profile?.blog_title && (
                <span className="hidden truncate font-heading sm:inline">
                  {profile.blog_title}
                </span>
              )}
              <Heart
                className="h-3.5 w-3.5 fill-accent text-accent transition-transform duration-200 group-hover:scale-125"
                strokeWidth={1.5}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative cursor-pointer px-3 py-3 text-sm transition-colors duration-200 ease-out ${
                    isActive
                      ? "text-accent"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 头像入口（同参考图右上角吉祥物位） */}
          <div className="flex items-center gap-1">
            <Link
              href="/about"
              aria-label="关于我"
              className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 transition-all duration-200 hover:border-accent sm:flex"
            >
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.nickname || "博主头像"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <Heart className="h-4 w-4 fill-accent text-accent" strokeWidth={1.5} />
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm text-white/80 transition-colors duration-200 ease-out hover:bg-night-soft hover:text-white lg:hidden"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`overflow-hidden border-t border-white/10 bg-night transition-all duration-300 ease-out lg:hidden ${
            isMenuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-4 py-3">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`cursor-pointer rounded-sm px-3 py-3 text-base transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-accent-subtle text-accent"
                      : "text-white/80 hover:bg-night-soft hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-18" />
    </>
  );
}
