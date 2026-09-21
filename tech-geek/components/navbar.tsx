"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Code2, Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  blogger,
  getModuleConfig,
  Blogger,
  ModuleConfig,
} from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  moduleKey?: keyof ModuleConfig;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/articles", label: "文章", moduleKey: "article_enabled" },
  { href: "/categories", label: "分类", moduleKey: "article_enabled" },
  { href: "/tags", label: "标签", moduleKey: "article_enabled" },
  { href: "/about", label: "关于我" },
  { href: "/music", label: "音乐", moduleKey: "music_enabled" },
];

interface NavbarProps {
  /** 构建期传入的初始值；客户端运行时会重新获取并覆盖 */
  initialModules: ModuleConfig;
  initialProfile: Blogger | null;
}

export function Navbar({ initialModules, initialProfile }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [modules, setModules] = useState<ModuleConfig>(initialModules);
  const [profile, setProfile] = useState<Blogger | null>(initialProfile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // 运行时重新获取模块配置与博主资料，覆盖构建期固化值（静态导出双保险）
  useEffect(() => {
    let cancelled = false;
    getModuleConfig().then((config) => {
      if (!cancelled) setModules(config);
    });
    blogger
      .get()
      .then((data) => {
        if (cancelled || !data) return;
        setProfile(data);
        // 弥补静态导出下构建期后端不可达、元数据未写入的情况
        if (data.blog_title && !document.title.includes(data.blog_title)) {
          document.title = document.title
            ? `${document.title} | ${data.blog_title}`
            : data.blog_title;
        }
        if (data.blog_icon) {
          const link =
            document.querySelector<HTMLLinkElement>('link[rel="icon"]') ??
            (() => {
              const el = document.createElement("link");
              el.rel = "icon";
              document.head.appendChild(el);
              return el;
            })();
          if (!link.href.includes(data.blog_icon)) link.href = data.blog_icon;
        }
      })
      .catch(() => setProfile(initialProfile));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navItems = NAV_ITEMS.filter(
    (item) => !item.moduleKey || modules[item.moduleKey]
  );

  const githubLink = profile?.social_links?.find(
    (link) => link.platform.toLowerCase() === "github"
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchValue.trim();
    router.push(keyword ? `/articles?keyword=${encodeURIComponent(keyword)}` : "/articles");
    setMobileOpen(false);
  };

  const renderNavLink = (item: NavItem, isMobile = false) => {
    const active =
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isMobile ? "flex items-center px-3 py-2.5" : "flex items-center px-3 py-2",
          active
            ? "text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {item.label}
        {active && (
          <span className="absolute inset-x-3 -bottom-[13px] hidden h-0.5 rounded-full bg-primary md:block" />
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {profile?.blog_icon ? (
            <Image
              src={profile.blog_icon}
              alt={profile.blog_title || "logo"}
              width={28}
              height={28}
              className="h-7 w-7 rounded object-cover"
              unoptimized
            />
          ) : (
            <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />
          )}
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            {profile?.blog_title || "Tech Geek"}
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="主导航">
          {navItems.map((item) => renderNavLink(item))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* 桌面端搜索 */}
          <form
            onSubmit={handleSearch}
            className="relative hidden lg:block"
            role="search"
          >
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索文章、技术、标签..."
              className="h-9 w-52 pl-8 xl:w-64"
              aria-label="搜索文章"
            />
          </form>

          <ThemeToggle />

          {githubLink && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              <a
                href={githubLink.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.468-2.381 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.807 5.625-5.48 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.192.694.8.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            <form onSubmit={handleSearch} className="relative pb-2" role="search">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索文章、技术、标签..."
                className="h-10 pl-8"
                aria-label="搜索文章"
              />
            </form>
            <nav className="space-y-1" aria-label="移动端导航">
              {navItems.map((item) => renderNavLink(item, true))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
