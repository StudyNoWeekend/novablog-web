"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { blogger, Blogger } from "@/lib/api";
import { SocialIcon } from "@/components/social-icons";
import themeInfo from "@/theme.json";

interface FooterProps {
  /** 构建期传入的初始值；客户端运行时会重新获取并覆盖 */
  initialProfile: Blogger | null;
}

export function Footer({ initialProfile }: FooterProps) {
  const [info, setInfo] = useState<Blogger | null>(initialProfile);

  // 运行时重新获取博主资料，覆盖构建期固化值（静态导出双保险）
  useEffect(() => {
    let cancelled = false;
    blogger
      .get()
      .then((data) => {
        if (!cancelled) setInfo(data);
      })
      .catch(() => {
        // 静默失败，保留构建时传入的值
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const socialLinks = [...(info?.social_links ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-mono text-lg font-semibold text-foreground">
              {info?.blog_title || "Tech Geek Blog"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {info?.blog_description || "记录代码与思考"}
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform + link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={link.name || link.platform}
                >
                  <SocialIcon link={link} className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          {themeInfo.homepage && (
            <p>
              来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                NovaBlog 官方主题
              </a>
            </p>
          )}
          <nav className="flex items-center gap-4" aria-label="页脚导航">
            <Link
              href="/"
              className="rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              首页
            </Link>
            <Link
              href="/categories"
              className="rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              分类
            </Link>
            <Link
              href="/tags"
              className="rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              标签
            </Link>
            <Link
              href="/about"
              className="rounded-md transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              关于我
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
