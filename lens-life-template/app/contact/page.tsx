"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBloggerProfile } from "@/lib/api/blogger";
import type { BloggerProfile } from "@/lib/api/blogger";
import { Mail, MapPin, Instagram } from "lucide-react";

const DEFAULT_EMAIL = "hello@lenslife.blog";
const DEFAULT_PHOTOGRAPHER_NAME = "博主";
const DEFAULT_PHOTOGRAPHER_TAGLINE = "用镜头收藏世界的边角与光芒";

function SocialLinkItem({ platform, url }: { platform: string; url: string }) {
  const isInstagram = platform.toLowerCase() === "instagram";

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform}
      className="group flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-radius-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-muted transition-all duration-200 ease-out hover:border-accent hover:bg-accent-subtle hover:text-accent"
    >
      {isInstagram ? (
        <Instagram className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-subtle text-xs text-accent">
          {platform.slice(0, 1)}
        </span>
      )}
      <span>{platform}</span>
    </Link>
  );
}

export default function ContactPage() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);

  useEffect(() => {
    getBloggerProfile().then(setProfile);
  }, []);

  // Social links from API only
  const socialLinks = profile?.social_links?.length
    ? profile.social_links.map((s) => ({
        platform: s.name || s.platform,
        url: s.url,
      }))
    : [];

  const avatar = profile?.avatar;
  const name = profile?.nickname || DEFAULT_PHOTOGRAPHER_NAME;
  const tagline =
    profile?.bio
      ? profile.bio.length > 30
        ? `${profile.bio.slice(0, 30)}...`
        : profile.bio
      : DEFAULT_PHOTOGRAPHER_TAGLINE;

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-background-soft py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-playfair)] text-3xl font-medium italic text-text-primary sm:text-4xl">
            联系我
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted" />
        </div>
      </section>

      <section className="flex-1 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg">
            {/* Contact info card */}
            <div className="rounded-radius-lg border border-border bg-surface p-6 shadow-card sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-border">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="h-full w-full bg-background-soft" />
                  )}
                </div>
                <h2 className="mt-4 font-[var(--font-playfair)] text-xl font-medium italic text-text-primary">
                  {name}
                </h2>
                <p className="mt-1 text-sm text-text-muted">{tagline}</p>
              </div>

              <div className="mt-8 space-y-4">
                <a
                  href={`mailto:${profile?.email || DEFAULT_EMAIL}`}
                  className="group flex cursor-pointer items-center gap-4 rounded-radius-md border border-border bg-background p-4 transition-all duration-200 ease-out hover:border-accent"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted">邮箱</p>
                    <p className="truncate text-sm font-medium text-text-primary transition-colors group-hover:text-accent">
                      {profile?.email || DEFAULT_EMAIL}
                    </p>
                  </div>
                </a>

                {profile?.city && (
                  <div className="flex items-center gap-4 rounded-radius-md border border-border bg-background p-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                      <MapPin className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-xs text-text-muted">所在地</p>
                      <p className="text-sm font-medium text-text-primary">
                        {profile.city}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-center text-sm font-medium text-text-primary">社交媒体</h3>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {socialLinks.map((link) => (
                      <SocialLinkItem
                        key={link.platform}
                        platform={link.platform}
                        url={link.url}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}