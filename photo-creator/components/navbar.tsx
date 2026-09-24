"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialLinks } from "./social-links";
import type { Blogger } from "@/lib/api";

const navLinks = [
  { number: "01", label: "作品", href: "/" },
  { number: "02", label: "故事", href: "/portfolios" },
  { number: "03", label: "音乐", href: "/music" },
  { number: "04", label: "日志", href: "/articles" },
  { number: "05", label: "关于", href: "/#about" },
  { number: "06", label: "联系", href: "/#contact" },
];

interface NavbarProps {
  blogger: Blogger | null;
}

export function Navbar({ blogger }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const title = blogger?.blog_title?.trim() || "摄影作品集";
  const nickname = blogger?.nickname?.trim();
  const initial = (nickname || title || "摄").charAt(0).toUpperCase();
  const titleFirst = nickname || title;
  const titleSecond =
    nickname && blogger?.blog_title && blogger.blog_title !== nickname
      ? blogger.blog_title
      : "摄影日志";

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

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex cursor-pointer items-baseline gap-1.5 rounded-md py-1 text-xs font-medium tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-heading text-[10px] text-primary">
                  {link.number}
                </span>
                <span>{link.label}</span>
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
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-baseline gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-heading text-xs text-primary">
                  {link.number}
                </span>
                <span className="tracking-[0.08em]">{link.label}</span>
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
