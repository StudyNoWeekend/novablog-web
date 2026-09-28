"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Mountain, Search, X } from "lucide-react";
import type { ModuleConfig } from "@/lib/types";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import { SocialIcons } from "@/components/SocialIcons";
import { filterMoreItems } from "@/components/more-nav-items";

interface NavItem {
  label: string;
  href: string;
  moduleKey?: keyof ModuleConfig;
}

/** 主导航固定项（「更多」下拉插入在末尾固定项之前） */
const NAV_ITEMS: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "目的地", href: "/destinations", moduleKey: "travel_enabled" },
  { label: "游记", href: "/articles", moduleKey: "article_enabled" },
  { label: "攻略", href: "/travels", moduleKey: "travel_enabled" },
  { label: "装备", href: "/gear", moduleKey: "equipment_enabled" },
  { label: "音乐", href: "/music", moduleKey: "music_enabled" },
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

export function Navbar({ modules: serverModules }: NavbarProps) {
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
    return () => {
      cancelled = true;
    };
  }, []);

  // 客户端获取博主资料（Logo / 社交图标）
  useEffect(() => {
    let cancelled = false;
    apiFetch<BloggerProfile>("/public/blogger")
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          if (data?.blog_title && !document.title.includes(data.blog_title)) {
            document.title = document.title
              ? `${document.title} | ${data.blog_title}`
              : data.blog_title;
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // 优先使用运行时获取的配置，降级到构建时 prop
  const modules = runtimeModules ?? serverModules;

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
  // （渲染期根据路由变化调整状态，避免在 effect 内同步 setState）
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsMoreOpen(false);
    setIsMenuOpen(false);
  }

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const kw = keyword.trim();
    if (!kw) return;
    setIsSearchOpen(false);
    setKeyword("");
    closeMenu();
    router.push(`/travels?keyword=${encodeURIComponent(kw)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 cursor-pointer items-center gap-2"
          onClick={closeMenu}
        >
          <Mountain
            className="h-6 w-6 text-accent transition-transform duration-300 group-hover:-translate-y-0.5"
            strokeWidth={1.8}
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl text-text-primary transition-colors duration-200 group-hover:text-accent">
              {profile?.blog_title || "WanderLina"}
            </span>
            {profile?.blog_description && (
              <span className="mt-1 max-w-[12rem] truncate text-[10px] tracking-[0.18em] text-text-subtle">
                — {profile.blog_description} —
              </span>
            )}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActivePath(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative cursor-pointer px-3 py-2.5 text-[15px] transition-colors duration-200 ${
                  active
                    ? "font-medium text-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
                {active && (
                  <span className="hand-underline absolute inset-x-3 bottom-0.5" />
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
                className={`relative flex min-h-11 cursor-pointer items-center gap-1 rounded-radius-sm px-3 py-2.5 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
                  <span className="hand-underline absolute inset-x-3 bottom-0.5" />
                )}
              </button>

              {/* 下拉面板：右对齐于触发器 */}
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
                        className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 px-4 text-sm transition-colors duration-200 ease-out hover:bg-surface-highlight hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
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
            const active = isActivePath(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative cursor-pointer px-3 py-2.5 text-[15px] transition-colors duration-200 ${
                  active
                    ? "font-medium text-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
                {active && (
                  <span className="hand-underline absolute inset-x-3 bottom-0.5" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: search + social + mobile menu */}
        <div className="flex items-center gap-1.5">
          {/* Expandable search */}
          <form
            onSubmit={submitSearch}
            className={`hidden items-center overflow-hidden transition-all duration-300 md:flex ${
              isSearchOpen ? "w-52 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索目的地 / 攻略..."
              aria-label="搜索目的地与攻略"
              className="min-h-9 w-full rounded-full border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
            />
          </form>
          <button
            type="button"
            aria-label={isSearchOpen ? "关闭搜索" : "打开搜索"}
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-200 hover:bg-accent-subtle hover:text-accent md:flex"
          >
            {isSearchOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Search className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>

          {/* Social icons */}
          {profile?.social_links && profile.social_links.length > 0 && (
            <div className="hidden md:flex">
              <SocialIcons links={profile.social_links} />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 hover:bg-accent-subtle hover:text-text-primary lg:hidden"
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
        className={`overflow-hidden border-t border-border bg-background transition-all duration-300 lg:hidden ${
          isMenuOpen ? "max-h-[50rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-4 py-3">
          {navItems.map((item) => {
            const active = isActivePath(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`cursor-pointer rounded-radius-sm px-3 py-3 text-base transition-colors duration-200 ${
                  active
                    ? "bg-accent-subtle font-medium text-accent"
                    : "text-text-secondary hover:bg-surface-highlight hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {tailNavItems.map((item) => {
            const active = isActivePath(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`cursor-pointer rounded-radius-sm px-3 py-3 text-base transition-colors duration-200 ${
                  active
                    ? "bg-accent-subtle font-medium text-accent"
                    : "text-text-secondary hover:bg-surface-highlight hover:text-text-primary"
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
                    className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-radius-sm px-3 text-base transition-colors duration-200 ${
                      isActive
                        ? "bg-accent-subtle font-medium text-accent"
                        : "text-text-secondary hover:bg-surface-highlight hover:text-text-primary"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
          {/* Mobile search */}
          <form onSubmit={submitSearch} className="mt-2 flex items-center gap-2 px-3 pb-1">
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索目的地 / 攻略..."
              aria-label="搜索目的地与攻略"
              className="min-h-10 w-full rounded-full border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-white transition-colors duration-200 hover:bg-accent-hover"
              aria-label="搜索"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
