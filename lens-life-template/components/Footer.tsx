import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";

interface FooterProps {
  profile: BloggerProfile | null;
}

const DEFAULT_EMAIL = "hello@lenslife.blog";

function SocialIcon({ platform, url }: { platform: string; url: string }) {
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
              {profile?.blog_icon && (
                <img
                  src={profile.blog_icon}
                  alt={profile.blog_title || ""}
                  className="h-6 w-6 rounded object-cover"
                />
              )}
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
              href={`mailto:${profile?.email || DEFAULT_EMAIL}`}
              className="flex cursor-pointer items-center gap-1.5 transition-colors duration-200 ease-out hover:text-text-primary"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              <span>{profile?.email || DEFAULT_EMAIL}</span>
            </a>
            {profile?.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                <span>{profile.city}</span>
              </span>
            )}
          </div>

          {/* Social Icons — only from profile */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <SocialIcon
                  key={link.platform}
                  platform={link.platform}
                  url={link.url}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-subtle">
          <p>© {currentYear} {profile?.nickname || "Lens & Life"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}