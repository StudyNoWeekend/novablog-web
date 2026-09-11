"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, PlaySquare, FileText, Home, Globe } from "lucide-react";
import { blogger, type Blogger } from "@/lib/api";

const navLinks = [
  { href: "/", label: "首页", icon: Home },
  { href: "/videos", label: "视频", icon: PlaySquare },
  { href: "/articles", label: "文章", icon: FileText },
];

export function Navbar() {
  const [info, setInfo] = useState<Blogger | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    blogger
      .get()
      .then(setInfo)
      .catch(() => setInfo(null));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            {info?.blog_icon ? (
              <Image
                src={info.blog_icon}
                alt={info.blog_title || "博客"}
                width={36}
                height={36}
                className="rounded-lg object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-creator font-bold">
                M
              </div>
            )}
            <span className="text-lg font-bold text-foreground">
              {info?.blog_title || "Media Creator"}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {info?.social_links?.slice(0, 4).map((link) => (
              <a
                key={link.platform + link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={link.platform}
              >
                <Globe className="h-3.5 w-3.5" />
                {link.platform}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground transition-colors hover:bg-muted-foreground/10 focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <link.icon className="h-5 w-5 text-primary" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <p className="px-4 py-2 text-xs font-medium text-muted-foreground">社交平台</p>
              <div className="flex flex-wrap gap-2 px-4 pt-1">
                {info?.social_links?.map((link) => (
                  <a
                    key={link.platform + link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
