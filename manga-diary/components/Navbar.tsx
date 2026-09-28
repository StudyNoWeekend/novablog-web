"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import type { ModuleConfig } from "@/lib/types";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import { CatFace } from "@/components/ComicDoodle";
import { filterMoreItems } from "@/components/more-nav-items";

interface NavItem {
  label: string;
  href: string;
  moduleKey?: keyof ModuleConfig;
}

/** 主导航固定项（「更多」下拉插入在末尾固定项之前） */
const NAV_ITEMS: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "作品", href: "/portfolio", moduleKey: "portfolio_enabled" },
  { label: "动态", href: "/articles", moduleKey: "article_enabled" },
  { label: "音乐", href: "/music", moduleKey: "music_enabled" },
];

/** 主导航末尾固定项（置于「更多」下拉之后） */
const TAIL_NAV_ITEMS: NavItem[] = [
  { label: "关于我", href: "/about" },
  { label: "留言", href: "/contact" },
];

const ALL_ENABLED: ModuleConfig = {
  article_enabled: true,
  media_enabled: true,
  music_enabled: true,
  video_enabled: true,
  travel_enabled: true,
  portfolio_enabled: true,
  equipment_enabled: true,
  open_source_enabled: true,
  recipe_enabled: true,
  book_enabled: true,
  game_enabled: true,
  fitness_enabled: true,
  tech_stack_enabled: true,
  updated_at: "",
};

interface NavbarProps {
  modules: ModuleConfig;
}

/** 墨黑页头：猫 logo + 博客名 + 手绘风导航（黄色下划线）+ 搜索 / 头像 */
export function Navbar({ modules: _modules }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 「更多」下拉开合状态
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
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
  const tailNavItems = TAIL_NAV_ITEMS.filter(
    (item) => !item.moduleKey || modules[item.moduleKey]
  );
  // 「更多」下拉子项：随模块开关过滤，六个全关时整个下拉不渲染
  const moreItems = filterMoreItems(modules);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const isActivePath = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  // 当前路径命中任一子项时，「更多」触发器高亮
  const isMoreActive = moreItems.some((item) => isActivePath(item.href));

  // 「更多」下拉：点击面板外部 / Escape 关闭
  useEffect(() => {
    if (!isMoreOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoreOpen]);

  // 路由跳转后自动关闭下拉与移动端菜单
  useEffect(() => {
    setIsMoreOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-ink text-[#f3efe4]">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="group flex shrink-0 cursor-pointer items-center gap-2.5"
              onClick={closeMenu}
            >
              {profile?.blog_icon ? (
                <img
                  src={profile.blog_icon}
                  alt={profile.blog_title || ""}
                  className="h-9 w-9 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <CatFace className="h-9 w-9 text-accent" />
              )}
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-display text-lg text-white transition-colors duration-200 group-hover:text-accent">
                  {profile?.blog_title || ""}
                </span>
                {profile?.blog_description && (
                  <span className="hidden truncate text-[11px] tracking-[0.18em] text-white/50 sm:inline">
                    — {profile.blog_description} —
                  </span>
                )}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative cursor-pointer px-3 py-3 text-sm transition-colors duration-200 ease-out ${
                    isActive
                      ? "text-accent"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}

            {/* 「更多」下拉（子项随模块开关过滤，全关时不渲染） */}
            {moreItems.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isMoreOpen}
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  className={`relative flex min-h-11 cursor-pointer items-center gap-1 rounded-radius-sm px-3 py-3 text-sm transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isMoreActive || isMoreOpen
                      ? "text-accent"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  更多
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isMoreOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                  {isMoreActive && (
                    <span className="absolute bottom-0 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </button>

                {/* 下拉面板：右对齐于触发器（米纸底 + 圆角边框 + 阴影） */}
                {isMoreOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-radius-md border border-border bg-background/95 py-1.5 shadow-card backdrop-blur-md"
                  >
                    {moreItems.map((item) => {
                      const isActive = isActivePath(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setIsMoreOpen(false)}
                          className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 px-4 text-sm transition-colors duration-200 ease-out hover:bg-surface-highlight hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                            isActive ? "text-accent-hover" : "text-text-secondary"
                          }`}
                        >
                          <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {tailNavItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative cursor-pointer px-3 py-3 text-sm transition-colors duration-200 ease-out ${
                    isActive
                      ? "text-accent"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 右侧动作：搜索 + 头像 */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/articles"
              aria-label="搜索创作动态"
              title="搜索创作动态"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/75 transition-colors duration-200 hover:bg-white/10 hover:text-accent"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              href="/about"
              aria-label="关于我"
              title="关于我"
              className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/25 bg-white/10 transition-colors duration-200 hover:border-accent"
            >
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.nickname || ""}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <CatFace className="h-5 w-5 text-white/80" />
              )}
            </Link>
            <button
              type="button"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/75 transition-colors duration-200 ease-out hover:bg-white/10 hover:text-white lg:hidden"
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
          className={`overflow-hidden bg-ink transition-all duration-300 ease-out lg:hidden ${
            isMenuOpen ? "max-h-[42rem] border-t border-white/10 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-4 py-3">
            {navItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`cursor-pointer rounded-radius-sm px-3 py-3 text-base transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {tailNavItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`cursor-pointer rounded-radius-sm px-3 py-3 text-base transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* 「更多功能」小节：六个新模块入口平铺，随模块开关过滤 */}
            {moreItems.length > 0 && (
              <div className="mt-2 border-t border-white/10 pt-3">
                <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-widest text-white/40">
                  更多功能
                </p>
                {moreItems.map((item) => {
                  const isActive = isActivePath(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-radius-sm px-3 text-base transition-colors duration-200 ease-out ${
                        isActive
                          ? "bg-accent/15 text-accent"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-18" />
    </>
  );
}
