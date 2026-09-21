"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Rss, Mail, Globe } from "lucide-react";
import { blogger, Blogger } from "@/lib/api";
import themeInfo from "@/theme.json";

/* lucide-react 1.x 移除了品牌图标，社交品牌图标使用内联 SVG（Simple Icons 路径） */
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.468-2.381 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.807 5.625-5.48 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.192.694.8.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  twitter: TwitterIcon,
  x: TwitterIcon,
  rss: Rss,
  email: Mail,
  website: Globe,
};

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
              {socialLinks.map((link) => {
                const Icon = iconMap[link.platform.toLowerCase()] || Globe;
                return (
                  <a
                    key={link.platform + link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={link.name || link.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
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
