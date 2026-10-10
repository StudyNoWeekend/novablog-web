"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, ChevronDown, Menu, Search, User, X } from "lucide-react";
import type { ModuleConfig } from "@/lib/types";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import {
  ALL_MODULE_CONFIG,
  filterNavModules,
  splitNavModules,
  type NavModule,
} from "@/components/nav-modules";

/** 主导航末尾固定项（置于「更多」下拉之后，不占 10 个模块名额） */
const TAIL_NAV_ITEMS: NavModule[] = [
  { label: "关于我", href: "/about", icon: User },
];

interface NavbarProps {
  modules: ModuleConfig;
}

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
          setRuntimeModules({ ...ALL_MODULE_CONFIG, ...config });
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

  // 内容模块：桌面端前 10 项平铺，其余收纳进「更多」；移动端全量平铺
  const { mainItems, moreItems } = splitNavModules(modules);
  const mobileItems = filterNavModules(modules);
  const tailNavItems = TAIL_NAV_ITEMS.filter(
    (item) => !item.moduleKey || modules[item.moduleKey]
  );

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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo + 站点标语 */}
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 cursor-pointer items-center gap-2.5"
            onClick={closeMenu}
          >
            {profile?.blog_icon ? (
              <img
                src={profile.blog_icon}
                alt={profile.blog_title || ""}
                className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                <ChefHat className="h-5.5 w-5.5" strokeWidth={1.6} />
              </span>
            )}
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-display text-lg leading-tight text-text-primary transition-colors duration-200 group-hover:text-accent">
                {profile?.blog_title || "美食日记"}
              </span>
              {profile?.blog_description && (
                <span className="truncate text-[11px] leading-tight text-text-muted">
                  — {profile.blog_description} —
                </span>
              )}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {/* 首页固定项（不占模块名额） */}
            <NavTextLink href="/" label="首页" pathname={pathname} />

            {/* 内容模块前 10 项平铺 */}
            {mainItems.map((item) => (
              <NavTextLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}

            {/* 「更多」下拉（子项随模块开关过滤，全关时不渲染） */}
            {moreItems.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isMoreOpen}
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  className={`relative flex min-h-11 cursor-pointer items-center gap-1 px-3.5 py-3 text-sm transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isMoreActive || isMoreOpen
                      ? "font-medium text-text-primary"
                      : "text-text-muted hover:text-text-primary"
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
                    <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-accent" />
                  )}
                </button>

                {/* 下拉面板：右对齐于触发器 */}
                {isMoreOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-md border border-border bg-background/95 py-1.5 shadow-card backdrop-blur-md"
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
                            isActive ? "font-medium text-accent-hover" : "text-text-secondary"
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

            {tailNavItems.map((item) => (
              <NavTextLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </div>

          {/* Search + Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* 关键词搜索（纯 HTML GET 表单，静态托管可用） */}
            <form action="/articles" method="GET" className="hidden xl:block">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                  strokeWidth={1.5}
                />
                <input
                  type="search"
                  name="keyword"
                  placeholder="搜索你想看的美食..."
                  aria-label="搜索美食日记"
                  className="h-10 w-48 rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:w-56 focus:border-accent focus:outline-none"
                />
              </div>
            </form>
            <button
              type="button"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-200 ease-out hover:bg-background-soft hover:text-text-primary lg:hidden"
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
            isMenuOpen ? "max-h-[60rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-4 py-3">
            {/* 移动端搜索 */}
            <form action="/articles" method="GET" className="mb-2 lg:hidden">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                  strokeWidth={1.5}
                />
                <input
                  type="search"
                  name="keyword"
                  placeholder="搜索你想看的美食..."
                  aria-label="搜索美食日记"
                  className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
                />
              </div>
            </form>

            {/* 首页固定项 */}
            <MobileNavLink
              href="/"
              label="首页"
              active={isActivePath("/")}
              onClick={closeMenu}
            />

            {/* 内容模块全量平铺（不受桌面端 10 项限制） */}
            {mobileItems.map((item) => (
              <MobileNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={<item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />}
                active={isActivePath(item.href)}
                onClick={closeMenu}
              />
            ))}

            {/* 尾部固定项 */}
            {tailNavItems.map((item) => (
              <MobileNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActivePath(item.href)}
                onClick={closeMenu}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}

/** 桌面端平铺文字导航项（蜜糖橙短下划线激活态） */
function NavTextLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return (
    <Link
      href={href}
      className={`relative cursor-pointer px-3.5 py-3 text-sm transition-colors duration-200 ease-out ${
        isActive
          ? "font-medium text-text-primary"
          : "text-text-muted hover:text-text-primary"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-accent" />
      )}
    </Link>
  );
}

/** 移动端菜单链接项 */
function MobileNavLink({
  href,
  label,
  active,
  onClick,
  icon,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-full px-4 py-3 text-base transition-colors duration-200 ease-out ${
        active
          ? "bg-accent-subtle font-medium text-accent-hover"
          : "text-text-secondary hover:bg-background-soft hover:text-text-primary"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
