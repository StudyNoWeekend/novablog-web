"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialLinks } from "./social-links";
import {
  filterNavModules,
  splitNavModules,
  moduleNumber,
  type NavModule,
} from "./nav-modules";
import {
  ALL_ENABLED_MODULE_CONFIG,
  getModuleConfig,
  type Blogger,
  type ModuleConfig,
} from "@/lib/api";

/** 尾部锚点固定项（置于「更多」下拉之后，不占 10 个模块名额） */
const TAIL_NAV_ITEMS: NavModule[] = [
  { label: "关于", href: "/#about", icon: User },
  { label: "联系", href: "/#contact", icon: Mail },
];

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

  const isActivePath = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  // 内容模块：桌面端前 10 项平铺（01-10 编号），其余收纳进「更多」；移动端全量平铺
  const { mainItems, moreItems } = splitNavModules(modules);
  const mobileItems = filterNavModules(modules);

  // 「更多」子项随模块开关过滤；全关时整个下拉组不渲染
  // 当前路径命中任一「更多」子项时触发器高亮
  const moreActive = moreItems.some((item) => isActivePath(item.href));

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
            {/* 首页固定项（即作品墙，不占模块名额，无编号） */}
            <Link
              href="/"
              aria-current={isHome ? "page" : undefined}
              className={cn(
                "flex cursor-pointer items-center rounded-md py-1 text-xs font-medium tracking-[0.12em] transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                isHome ? "text-primary" : "text-foreground/70"
              )}
            >
              作品
            </Link>

            {/* 内容模块前 10 项平铺（按 01-10 重新编号） */}
            {mainItems.map((item, index) => (
              <NumberedNavLink
                key={item.href}
                item={item}
                number={moduleNumber(index)}
                active={isActivePath(item.href)}
              />
            ))}

            {/* 「更多」下拉组（溢出模块，带 icon 不带编号）：末尾固定项之前 */}
            {moreItems.length > 0 && (
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
                    {moreItems.map((item) => {
                      const active = isActivePath(item.href);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setMoreOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-lg px-4 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            active
                              ? "text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className="size-4 shrink-0" aria-hidden="true" />
                          <span className="tracking-wide">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 尾部锚点固定项（关于/联系，不占模块名额） */}
            {TAIL_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex cursor-pointer items-center rounded-md py-1 text-xs font-medium tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
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
            {/* 首页固定项 */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-current={isHome ? "page" : undefined}
              className={cn(
                "flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                isHome ? "text-primary" : "text-foreground"
              )}
            >
              <span className="tracking-[0.08em]">作品</span>
            </Link>

            {/* 内容模块全量平铺（不受 10 限制，按 01-12 重新编号） */}
            {mobileItems.map((item, index) => {
              const active = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="flex cursor-pointer items-baseline gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className={cn("font-heading text-xs", active ? "text-primary" : "text-primary/80")}>
                    {moduleNumber(index)}
                  </span>
                  <span className="tracking-[0.08em]">{item.label}</span>
                </Link>
              );
            })}

            {/* 尾部锚点固定项 */}
            {TAIL_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-baseline gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-heading text-xs text-primary/80">—</span>
                <span className="tracking-[0.08em]">{item.label}</span>
              </Link>
            ))}

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

/** 桌面端平铺编号导航项（01-10 重新编号，激活高亮） */
function NumberedNavLink({
  item,
  number,
  active,
}: {
  item: NavModule;
  number: string;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex cursor-pointer items-baseline gap-1.5 rounded-md py-1 text-xs font-medium tracking-[0.12em] transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        active ? "text-primary" : "text-foreground/70"
      )}
    >
      <span className="font-heading text-[10px] text-primary">{number}</span>
      <span>{item.label}</span>
    </Link>
  );
}
