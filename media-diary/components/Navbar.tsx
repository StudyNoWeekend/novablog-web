"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Play, User, X } from "lucide-react";
import type { ModuleConfig } from "@/lib/types";
import type { BloggerProfile } from "@/lib/api/blogger";
import { apiFetch } from "@/lib/api/client";
import { SocialIcons } from "@/components/SocialIcons";
import {
  ALL_MODULE_CONFIG,
  filterNavModules,
  splitNavModules,
  type NavModule,
} from "@/components/nav-modules";

/** 主导航末尾固定项（置于「更多」下拉之后，不占 10 个模块名额） */
const TAIL_NAV_ITEMS: NavModule[] = [
  { label: "关于我", href: "/about", icon: User },
  { label: "合作联系", href: "/contact", icon: Mail },
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
      <header className="fixed inset-x-0 top-0 z-50 bg-ink/95 backdrop-blur-md">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Logo：黄色播放按钮 + 博客名（对应 UI 图左上角品牌区） */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="group flex shrink-0 cursor-pointer items-center gap-2.5"
              onClick={closeMenu}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-ink shadow-card transition-transform duration-200 group-hover:scale-105">
                <Play className="h-4 w-4 translate-x-px fill-current" strokeWidth={0} />
              </span>
              {profile?.blog_icon ? (
                <Image
                  src={profile.blog_icon}
                  alt={profile.blog_title || ""}
                  width={28}
                  height={28}
                  className="hidden h-7 w-7 rounded object-cover sm:block"
                />
              ) : null}
              <span className="truncate font-display text-lg tracking-wide text-white">
                {profile?.blog_title || "多媒体日记"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation：当前项黄色下划线（对应 UI 图导航态） */}
          <div className="hidden items-center gap-1 lg:flex">
            {/* 首页固定项（不占模块名额） */}
            <NavLink href="/" label="首页" pathname={pathname} />

            {/* 内容模块前 10 项平铺 */}
            {mainItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
            ))}

            {/* 「更多」下拉（子项随模块开关过滤，全关时不渲染） */}
            {moreItems.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isMoreOpen}
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  className={`relative flex min-h-11 cursor-pointer items-center gap-1 rounded-lg px-3 py-3 text-sm transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isMoreActive || isMoreOpen
                      ? "font-medium text-accent"
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
                    <span className="absolute bottom-1.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </button>

                {/* 下拉面板：右对齐于触发器 */}
                {isMoreOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-xl border border-border bg-background/95 py-1.5 shadow-card-hover backdrop-blur-md"
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

            {/* 尾部固定项（置于「更多」之后，不占模块名额） */}
            {tailNavItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
            ))}
          </div>

          {/* Desktop 社交图标 + 移动端菜单按钮 */}
          <div className="flex items-center gap-1">
            {profile?.social_links && profile.social_links.length > 0 && (
              <div className="mr-2 hidden xl:block">
                <SocialIcons
                  links={profile.social_links}
                  size="md"
                  variant="dark"
                />
              </div>
            )}
            <button
              type="button"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white/75 transition-colors duration-200 ease-out hover:bg-white/10 hover:text-white lg:hidden"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation：内容模块全量平铺（不受 10 项限制）+ 尾部固定项 */}
        <div
          className={`overflow-hidden border-t border-white/10 bg-ink transition-all duration-300 ease-out lg:hidden ${
            isMenuOpen ? "max-h-[64rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-4 py-3">
            {/* 首页固定项 */}
            <Link
              href="/"
              onClick={closeMenu}
              className={`cursor-pointer rounded-lg px-3 py-3 text-base transition-colors duration-200 ease-out ${
                isActivePath("/")
                  ? "bg-accent/15 text-accent"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              首页
            </Link>

            {/* 内容模块全量平铺 */}
            {mobileItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-lg px-3 py-3 text-base transition-colors duration-200 ease-out ${
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

            {/* 尾部固定项 */}
            {tailNavItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`cursor-pointer rounded-lg px-3 py-3 text-base transition-colors duration-200 ease-out ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* 移动端社交图标（导航内收起时可见） */}
            {profile?.social_links && profile.social_links.length > 0 && (
              <div className="mt-2 border-t border-white/10 px-3 pt-3">
                <SocialIcons
                  links={profile.social_links}
                  size="md"
                  variant="dark"
                />
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

/** 桌面端平铺文字导航项（当前项黄色下划线） */
function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return (
    <Link
      href={href}
      className={`relative cursor-pointer px-3 py-3 text-sm transition-colors duration-200 ease-out ${
        isActive
          ? "font-medium text-accent"
          : "text-white/75 hover:text-white"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-1.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
      )}
    </Link>
  );
}
