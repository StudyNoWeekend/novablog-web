"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Heart, Home, User, Mail } from "lucide-react";
import type { ModuleConfig } from "@/lib/types";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import {
  ALL_MODULE_CONFIG,
  filterNavModules,
  splitNavModules,
  type NavModule,
} from "@/components/nav-modules";

/** 主导航末尾固定项（置于「更多」下拉之后，不占 10 个模块名额；仅平铺文字，不渲染图标） */
const TAIL_NAV_ITEMS: NavModule[] = [
  { label: "关于我", href: "/about", icon: User },
  { label: "联系", href: "/contact", icon: Mail },
];

interface NavbarProps {
  modules: ModuleConfig;
}

export function Navbar({ modules: serverModules }: NavbarProps) {
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
  const modules = runtimeModules ?? serverModules;

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
            {/* 首页固定项（不占模块名额） */}
            <NavTextLink
              item={{ label: "首页", href: "/", icon: Home }}
              pathname={pathname}
            />

            {/* 内容模块前 10 项平铺 */}
            {mainItems.map((item) => (
              <NavTextLink key={item.href} item={item} pathname={pathname} />
            ))}

            {/* 「更多」下拉（子项随模块开关过滤，全关时不渲染） */}
            {moreItems.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isMoreOpen}
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  className={`relative flex min-h-11 cursor-pointer items-center gap-1 rounded-sm px-3 py-3 text-sm transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isMoreActive || isMoreOpen
                      ? "text-accent"
                      : "text-white/80 hover:text-white"
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
                    <span className="absolute bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </button>

                {/* 下拉面板：右对齐于触发器 */}
                {isMoreOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-md border border-white/15 bg-night-soft/95 py-1.5 shadow-card-hover backdrop-blur-md"
                  >
                    {moreItems.map((item) => {
                      const isActive = isActivePath(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setIsMoreOpen(false)}
                          className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 px-4 text-sm transition-colors duration-200 ease-out hover:bg-night hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                            isActive ? "text-accent" : "text-white/80"
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

            {/* 尾部固定项（置于「更多」之后） */}
            {tailNavItems.map((item) => (
              <NavTextLink key={item.href} item={item} pathname={pathname} />
            ))}
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
            isMenuOpen ? "max-h-[60rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-4 py-3">
            {/* 首页固定项 */}
            <Link
              href="/"
              onClick={closeMenu}
              className={`cursor-pointer rounded-sm px-3 py-3 text-base transition-colors duration-200 ease-out ${
                isActivePath("/")
                  ? "bg-accent-subtle text-accent"
                  : "text-white/80 hover:bg-night-soft hover:text-white"
              }`}
            >
              首页
            </Link>

            {/* 内容模块全量平铺（不受桌面端 10 项限制） */}
            {mobileItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-sm px-3 py-3 text-base transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-accent-subtle text-accent"
                      : "text-white/80 hover:bg-night-soft hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {item.label}
                </Link>
              );
            })}

            {/* 尾部固定项 */}
            {tailNavItems.map((item) => {
              const isActive = isActivePath(item.href);
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

/** 桌面端平铺文字导航项（下划线激活态） */
function NavTextLink({ item, pathname }: { item: NavModule; pathname: string }) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(`${item.href}/`));
  return (
    <Link
      href={item.href}
      className={`relative cursor-pointer px-3 py-3 text-sm transition-colors duration-200 ease-out ${
        isActive ? "text-accent" : "text-white/80 hover:text-white"
      }`}
    >
      {item.label}
      {isActive && (
        <span className="absolute bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
      )}
    </Link>
  );
}
