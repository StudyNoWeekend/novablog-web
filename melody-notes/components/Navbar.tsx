"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Headphones, Menu, Search, X } from "lucide-react";
import type { ModuleConfig } from "@/lib/types";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import { filterMoreItems } from "@/components/more-nav-items";

interface NavItem {
  label: string;
  href: string;
  moduleKey?: keyof ModuleConfig;
}

/** 主导航固定项（「更多」下拉插入在末尾固定项之前） */
const NAV_ITEMS: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "音乐推荐", href: "/music", moduleKey: "music_enabled" },
  { label: "歌单", href: "/playlists", moduleKey: "music_enabled" },
  { label: "文章", href: "/articles", moduleKey: "article_enabled" },
];

/** 主导航末尾固定项（置于「更多」下拉之后） */
const TAIL_NAV_ITEMS: NavItem[] = [
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

export function Navbar({ modules: _modules }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 「更多」下拉开合状态
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
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
  const closeMore = () => setIsMoreOpen(false);

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

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    setIsSearchOpen(false);
    setKeyword("");
    closeMenu();
    router.push(`/articles?keyword=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-background/95 to-background/75 backdrop-blur-md">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo + Mini Player */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="group flex shrink-0 cursor-pointer items-center gap-2"
              onClick={closeMenu}
            >
              {profile?.blog_icon ? (
                <img
                  src={profile.blog_icon}
                  alt={profile.blog_title || ""}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <Headphones className="h-6 w-6 text-accent" strokeWidth={1.5} />
              )}
              <span className="font-[var(--font-script)] text-2xl leading-none text-text-primary transition-colors duration-200 group-hover:text-accent">
                {profile?.blog_title || "Melody Notes"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative cursor-pointer px-3 py-3 text-sm transition-colors duration-200 ease-out ${
                    isActive
                      ? "font-medium text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
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
                  className={`relative flex min-h-11 cursor-pointer items-center gap-1 rounded-md px-3 py-3 text-sm transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isMoreActive || isMoreOpen
                      ? "font-medium text-accent"
                      : "text-text-secondary hover:text-text-primary"
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
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </button>

                {/* 下拉面板：右对齐于触发器 */}
                {isMoreOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-xl border border-border bg-background/95 py-1.5 shadow-card backdrop-blur-md"
                  >
                    {moreItems.map((item) => {
                      const isActive = isActivePath(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeMore}
                          className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 px-4 text-sm transition-colors duration-200 ease-out hover:bg-surface hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                            isActive ? "font-medium text-accent" : "text-text-secondary"
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
                      ? "font-medium text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Expandable search */}
            <form
              onSubmit={submitSearch}
              className="hidden items-center md:flex"
              aria-label="站内搜索"
            >
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索文章…"
                aria-label="搜索文章"
                className={`h-9 rounded-full border border-border bg-surface/80 text-sm text-text-primary placeholder:text-text-subtle transition-all duration-300 focus:border-accent focus:outline-none ${
                  isSearchOpen ? "w-40 px-3.5 opacity-100" : "w-0 border-transparent px-0 opacity-0"
                }`}
                tabIndex={isSearchOpen ? 0 : -1}
              />
              <button
                type="button"
                aria-label={isSearchOpen ? "关闭搜索" : "打开搜索"}
                onClick={() => {
                  setIsSearchOpen((prev) => !prev);
                }}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:bg-surface hover:text-accent"
              >
                <Search className="h-4.5 w-4.5" strokeWidth={1.5} />
              </button>
            </form>

            {/* Subscribe CTA */}
            <Link
              href="/#subscribe"
              className="hidden h-10 cursor-pointer items-center gap-1.5 rounded-full bg-accent-strong px-4 text-sm font-medium text-on-accent transition-all duration-200 ease-out hover:bg-accent-hover md:flex"
            >
              <Headphones className="h-4 w-4" strokeWidth={1.8} />
              订阅我
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 ease-out hover:bg-surface hover:text-text-primary lg:hidden"
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
          className={`overflow-hidden border-t border-border bg-background transition-all duration-300 ease-out lg:hidden ${
            isMenuOpen ? "max-h-[42rem] opacity-100" : "max-h-0 opacity-0"
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
                  className={`cursor-pointer rounded-md px-3 py-3 text-base transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-accent-subtle text-accent"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
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
                  className={`cursor-pointer rounded-md px-3 py-3 text-base transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-accent-subtle text-accent"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* 「更多功能」小节：六个新模块入口平铺，随模块开关过滤 */}
            {moreItems.length > 0 && (
              <div className="mt-2 border-t border-border pt-3">
                <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-widest text-text-subtle">
                  更多功能
                </p>
                {moreItems.map((item) => {
                  const isActive = isActivePath(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-md px-3 text-base transition-colors duration-200 ease-out ${
                        isActive
                          ? "bg-accent-subtle text-accent"
                          : "text-text-secondary hover:bg-surface hover:text-text-primary"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
            <Link
              href="/#subscribe"
              onClick={closeMenu}
              className="mt-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-accent-strong px-4 py-2.5 text-sm font-medium text-on-accent"
            >
              <Headphones className="h-4 w-4" strokeWidth={1.8} />
              订阅我
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-18" />
    </>
  );
}
