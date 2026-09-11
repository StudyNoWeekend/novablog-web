import Link from "next/link";
import { Instagram, Mail, MapPin, Aperture } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";

interface FooterProps {
  profile: BloggerProfile | null;
}

const DEFAULT_EMAIL = "hello@lenslife.blog";
const DEFAULT_LOCATION = "中国 · 上海";

const FALLBACK_SOCIALS: { label: string; url: string; icon: "ig" | "weibo" | "bilibili" | "xiaohongshu" }[] = [
  { label: "Instagram", url: "https://instagram.com/lenslife", icon: "ig" },
  { label: "微博", url: "https://weibo.com/lenslife", icon: "weibo" },
  { label: "Bilibili", url: "https://space.bilibili.com/lenslife", icon: "bilibili" },
  { label: "小红书", url: "https://xiaohongshu.com/lenslife", icon: "xiaohongshu" },
];

function SocialIcon({ platform, url, isFallback }: { platform: string; url: string; isFallback: boolean }) {
  if (isFallback) {
    const social = FALLBACK_SOCIALS.find((s) => s.label === platform);
    if (!social) return null;
    const Icon =
      social.icon === "ig" ? Instagram : null;
    return (
      <a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.label}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-sm font-medium text-text-muted transition-all duration-200 hover:border-accent hover:text-accent"
      >
        {social.icon === "ig" ? (
          <Instagram className="h-4 w-4" strokeWidth={1.5} />
        ) : social.icon === "weibo" ? (
          "微"
        ) : social.icon === "bilibili" ? (
          "B"
        ) : (
          "红"
        )}
      </a>
    );
  }

  const p = platform.toLowerCase();
  const isMail = p === "email" || p === "mail";
  return (
    <a
      href={isMail ? `mailto:${url}` : url}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      aria-label={platform}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-sm font-medium text-text-muted transition-all duration-200 hover:border-accent hover:text-accent"
    >
      {p === "instagram" ? (
        <Instagram className="h-4 w-4" strokeWidth={1.5} />
      ) : p === "weibo" || p === "微博" ? (
        "微"
      ) : p === "bilibili" || p === "b站" ? (
        "B"
      ) : p === "xiaohongshu" || p === "小红书" ? (
        "红"
      ) : (
        <span className="text-xs font-bold uppercase">{platform.slice(0, 2)}</span>
      )}
    </a>
  );
}

export function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const socialLinks = profile?.social_links?.length
    ? profile.social_links.map((s) => ({
        platform: s.name || s.platform,
        url: s.url,
      }))
    : [];

  return (
    <footer className="border-t border-border bg-background-soft">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link
              href="/"
              className="flex cursor-pointer items-center gap-2 text-lg font-medium tracking-wide text-text-primary transition-colors duration-200 ease-out hover:text-accent"
            >
              <Aperture className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <span className="font-[var(--font-playfair)] italic">
                {profile?.blog_title || "Lens & Life"}
              </span>
            </Link>
            <p className="text-sm text-text-muted">
              {profile?.blog_description || "用镜头收藏世界的边角与光芒"}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted">
            <a
              href={`mailto:${DEFAULT_EMAIL}`}
              className="flex cursor-pointer items-center gap-1.5 transition-colors duration-200 ease-out hover:text-text-primary"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              <span>{DEFAULT_EMAIL}</span>
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              <span>{DEFAULT_LOCATION}</span>
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.length > 0
              ? socialLinks.map((link) => (
                  <SocialIcon
                    key={link.platform}
                    platform={link.platform}
                    url={link.url}
                    isFallback={false}
                  />
                ))
              : FALLBACK_SOCIALS.map((s) => (
                  <SocialIcon
                    key={s.label}
                    platform={s.label}
                    url={s.url}
                    isFallback={true}
                  />
                ))}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-subtle">
          <p>© {currentYear} {profile?.nickname || "Lens & Life"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}