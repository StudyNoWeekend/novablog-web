"use client";

import Link from "next/link";
import { SocialLinks } from "./social-links";
import type { Blogger } from "@/lib/api";
import themeInfo from "@/theme.json";

interface FooterProps {
  blogger: Blogger | null;
}

export function Footer({ blogger }: FooterProps) {
  const title = blogger?.blog_title?.trim() || "摄影作品集";

  const emailLink = blogger?.social_links?.find((link) =>
    ["mail", "email"].includes(link.platform.toLowerCase())
  );
  const email = emailLink?.url?.replace(/^mailto:/i, "") || "";

  const socialLinks =
    blogger?.social_links?.filter(
      (link) => !["mail", "email"].includes(link.platform.toLowerCase())
    ) ?? [];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col items-center gap-8 text-center">
          <Link
            href="/#contact"
            className="group cursor-pointer rounded-md focus-visible:ring-2 focus-visible:ring-ring"
          >
            <h2 className="font-heading text-4xl font-light leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-5xl lg:text-6xl">
              让我们一起创造故事
            </h2>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {["编辑", "旅行", "纪实"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-4 py-1.5 text-sm tracking-wide text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="cursor-pointer rounded-md font-heading text-xl font-light tracking-wide text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:text-2xl"
              >
                {email}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">联系邮箱待设置</span>
            )}
            <span className="text-sm text-muted-foreground">{title}</span>
          </div>

          {socialLinks.length > 0 && <SocialLinks links={socialLinks} />}

          {themeInfo.homepage && (
            <p className="pt-8 text-xs text-muted-foreground">
              来源：
              <a
                href={themeInfo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-md transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
              >
                {themeInfo.homepage}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
