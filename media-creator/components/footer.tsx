"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Globe } from "lucide-react";
import { blogger, type Blogger } from "@/lib/api";
import themeInfo from "@/theme.json";

export function Footer() {
  const [info, setInfo] = useState<Blogger | null>(null);

  useEffect(() => {
    blogger
      .get()
      .then(setInfo)
      .catch(() => setInfo(null));
  }, []);

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-lg font-bold text-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-1"
            >
              {info?.blog_title || "Media Creator"}
            </Link>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {info?.blog_description || "分享视频、文章与创作生活"}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {info?.social_links?.map((link) => (
              <a
                key={link.platform + link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={link.platform}
              >
                <Globe className="h-4 w-4" />
                {link.platform}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          {themeInfo.homepage && (
            <p>
              来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                {themeInfo.homepage}
              </a>
            </p>
          )}
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" /> using Next.js & shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
}
