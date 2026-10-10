"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Camera, ChevronDown, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { blogger, moduleConfig, ALL_ENABLED, type Blogger, type ModuleConfig } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSocialHref, getSocialIcon, getSocialLabel, isEmailLink } from "@/components/social-icon";
import {
  filterNavModules,
  splitNavModules,
  type NavModule,
} from "@/components/nav-modules";

/** 主导航末尾固定项（置于「更多」下拉之后，不占 10 个模块名额） */
const TAIL_NAV_ITEMS: NavModule[] = [
  { label: "关于我", href: "/about" },
  { label: "联系", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [info, setInfo] = useState<Blogger | null>(null);
  const [modules, setModules] = useState<ModuleConfig>(ALL_ENABLED);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let cancelled = false;
    // 客户端运行时获取博主信息与模块开关，覆盖构建期的回退值
    blogger.get().then((data) => {
      if (!cancelled) setInfo(data);
    }).catch(() => {});
    moduleConfig.get().then((config) => {
      if (!cancelled) setModules(config);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const socialLinks = (info?.social_links ?? []).slice(0, 4);

  // 内容模块：桌面端前 10 项平铺，其余收纳进「更多」；移动端全量平铺
  const { mainItems, moreItems } = splitNavModules(modules);
  const mobileItems = filterNavModules(modules);
  const tailNavItems = TAIL_NAV_ITEMS.filter(
    (item) => !item.moduleKey || modules[item.moduleKey]
  );

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  // 当前路径命中任一「更多」子项时触发器高亮
  const moreActive = moreItems.some((item) => isActive(item.href));

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

  // 路由跳转后自动关闭「更多」下拉与移动端菜单
  useEffect(() => {
    setMoreOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(q ? `/articles?keyword=${encodeURIComponent(q)}` : "/articles");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* 品牌：图标 + 双行标题 */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-xl px-1 py-1 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {info?.blog_icon ? (
              <Image
                src={info.blog_icon}
                alt={info.blog_title || "博客图标"}
                width={38}
                height={38}
                className="h-[38px] w-[38px] rounded-xl object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Camera className="h-5 w-5" />
              </span>
            )}
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-base font-bold text-foreground">
                {info?.blog_title || "FrameWithMe"}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {info?.blog_description || "用镜头，记录热爱的世界"}
              </span>
            </span>
          </Link>

          {/* 桌面端居中导航 */}
          <div className="hidden lg:flex items-center gap-1">
            {/* 首页固定项（不占模块名额） */}
            <NavLink href="/" label="首页" active={isActive("/")} />

            {/* 内容模块前 10 项平铺（纯文字） */}
            {mainItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(item.href)}
              />
            ))}

            {/* 「更多」下拉组：子项随模块开关过滤，全关时整个下拉不渲染 */}
            {moreItems.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  aria-label="更多页面"
                  className={cn(
                    "relative flex cursor-pointer items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    moreActive || moreOpen
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
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
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                  )}
                </button>

                {moreOpen && (
                  <div
                    role="menu"
                    aria-label="更多页面菜单"
                    className="absolute right-0 top-full mt-3 w-44 rounded-2xl border border-border bg-background/95 p-1.5 shadow-xl backdrop-blur-md"
                  >
                    {moreItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setMoreOpen(false)}
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className={cn(
                            "flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-xl px-4 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isActive(item.href)
                              ? "text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                          {item.label}                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 尾部固定项（关于我 / 联系） */}
            {tailNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(item.href)}
              />
            ))}
          </div>

          {/* 右侧工具区 */}
          <div className="flex items-center gap-1">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-1 rounded-full border border-border bg-card pl-3 pr-1 py-1">
                  <input
                    autoFocus
                    type="search"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索文章…"
                    aria-label="搜索文章"
                    className="w-32 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="搜索"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="打开搜索"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Search className="h-[18px] w-[18px]" />
                </button>
              )}
            </form>

            <ThemeToggle />

            <div className="hidden md:flex items-center gap-1">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.platform + link.url}
                    href={getSocialHref(link)}
                    target={isEmailLink(link) ? undefined : "_blank"}
                    rel={isEmailLink(link) ? undefined : "noopener noreferrer"}
                    aria-label={getSocialLabel(link)}
                    title={getSocialLabel(link)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              className="lg:hidden inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 移动端菜单：内容模块全量平铺 + 尾部固定项 */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <form onSubmit={handleSearch} className="mb-3 flex items-center gap-2 md:hidden">
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索文章…"
                aria-label="搜索文章"
                className="h-10 flex-1 rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="搜索"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* 首页固定项 */}
            <MobileNavLink
              href="/"
              label="首页"
              active={isActive("/")}
              onClick={() => setMobileOpen(false)}
            />

            {/* 内容模块全量平铺（不受 10 项限制） */}
            {mobileItems.map((item) => {
              const Icon = item.icon;
              return (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : undefined}
                  active={isActive(item.href)}
                  onClick={() => setMobileOpen(false)}
                />
              );
            })}

            {/* 尾部固定项（关于我 / 联系） */}
            {tailNavItems.map((item) => (
              <MobileNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(item.href)}
                onClick={() => setMobileOpen(false)}
              />
            ))}

            <div className="flex items-center gap-2 border-t border-border px-4 pt-3">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.platform + link.url}
                    href={getSocialHref(link)}
                    target={isEmailLink(link) ? undefined : "_blank"}
                    rel={isEmailLink(link) ? undefined : "noopener noreferrer"}
                    aria-label={getSocialLabel(link)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/** 桌面端平铺文字导航项（激活态底部短横线） */
function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {active && (
        <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary" />
      )}
    </Link>
  );
}

/** 移动端菜单导航项（可选图标，激活态次背景高亮） */
function MobileNavLink({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
