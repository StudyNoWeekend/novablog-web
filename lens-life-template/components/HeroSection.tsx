"use client";

import React from "react";
import Image from "next/image";
import {
  AtSign,
  Camera,
  ChevronDown,
  Github,
  Instagram,
  Link as LinkIcon,
  Mail,
  Play,
  Twitter,
} from "lucide-react";
import { BloggerProfile, SocialLink } from "@/lib/api/blogger";

interface HeroSectionProps {
  profile: BloggerProfile | null;
}

const platformIconMap: Record<string, React.ElementType> = {
  instagram: Instagram,
  weibo: AtSign,
  bilibili: Play,
  youtube: Play,
  github: Github,
  twitter: Twitter,
  x: Twitter,
  email: Mail,
};

const platformLabelMap: Record<string, string> = {
  instagram: "Instagram",
  weibo: "微博",
  bilibili: "Bilibili",
  youtube: "YouTube",
  github: "GitHub",
  twitter: "Twitter",
  x: "X",
  email: "Email",
};

function getSocialIcon(platform: string): React.ElementType {
  const key = platform.toLowerCase();
  return platformIconMap[key] ?? LinkIcon;
}

function getSocialLabel(link: SocialLink): string {
  const key = link.platform.toLowerCase();
  return platformLabelMap[key] ?? link.platform;
}

function sortSocialLinks(links: SocialLink[]): SocialLink[] {
  return [...links].sort((a, b) => a.sort_order - b.sort_order);
}

export function HeroSection({ profile }: HeroSectionProps) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 72,
      behavior: "smooth",
    });
  };

  const backgroundUrl = profile?.page_background;
  const hasBackground = !!backgroundUrl;
  const hasApiSocialLinks =
    profile && profile.social_links && profile.social_links.length > 0;

  return (
    <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {hasBackground ? (
          <Image
            src={backgroundUrl!}
            alt={profile?.blog_title || "Landscape photography background"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {profile ? (
          <>
            <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-full border-2 border-accent/30 shadow-card md:h-36 md:w-36">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.nickname}
                  fill
                  sizes="144px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-text-muted/20" />
              )}
            </div>

            <h1 className="font-[var(--font-playfair)] text-5xl font-medium italic text-text-primary md:text-6xl lg:text-7xl">
              {profile.nickname}
            </h1>
          </>
        ) : (
          <>
            <div className="mb-6 h-28 w-28 animate-pulse rounded-full bg-text-muted/20 md:h-36 md:w-36" />
            <div className="mb-4 h-10 w-48 animate-pulse rounded-md bg-text-muted/20" />
          </>
        )}

        {/* Tags from API */}
        {profile && profile.tags && profile.tags.length > 0 ? (
          <div className="mt-4 flex items-center gap-3 text-sm font-medium tracking-wide text-text-muted md:text-base">
            {profile.tags.map((tag, index) => (
              <React.Fragment key={tag}>
                {index > 0 && (
                  <span className="h-1 w-1 rounded-full bg-accent" />
                )}
                <span>{tag}</span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="mt-4 h-5 w-32 animate-pulse rounded-md bg-text-muted/20" />
        )}

        {profile ? (
          <>
            {profile.blog_description && (
              <p className="mt-6 max-w-lg text-base leading-relaxed text-text-muted/80 md:text-lg">
                {profile.blog_description}
              </p>
            )}
            <p className={`max-w-md text-lg leading-relaxed text-text-secondary md:text-xl ${profile.blog_description ? "mt-3" : "mt-6"}`}>
              {profile.bio}
            </p>
          </>
        ) : (
          <>
            <div className="mt-4 h-5 w-48 animate-pulse rounded-md bg-text-muted/20" />
            <div className="mt-3 h-6 w-64 animate-pulse rounded-md bg-text-muted/20" />
          </>
        )}

        {/* Social Icons — only from API */}
        {profile && hasApiSocialLinks && (
          <div className="mt-8 flex items-center gap-4">
            {sortSocialLinks(profile.social_links).map((link) => {
              const Icon = getSocialIcon(link.platform);
              const label = getSocialLabel(link);
              const href =
                link.platform.toLowerCase() === "email" &&
                !link.url.startsWith("mailto:")
                  ? `mailto:${link.url}`
                  : link.url;
              const isEmail = link.platform.toLowerCase() === "email";

              return (
                <a
                  key={`${link.platform}-${link.sort_order}`}
                  href={href}
                  target={isEmail ? undefined : "_blank"}
                  rel={isEmail ? undefined : "noopener noreferrer"}
                  aria-label={label}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface/80 text-text-muted backdrop-blur-sm transition-all duration-200 ease-out hover:border-accent hover:text-accent"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Scroll Down Indicator */}
      <button
        type="button"
        onClick={scrollToContent}
        aria-label="向下滚动"
        className="absolute bottom-8 left-1/2 flex h-11 w-11 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-surface/50 text-text-muted backdrop-blur-sm transition-colors duration-200 ease-out hover:text-accent"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={1.5} />
      </button>
    </section>
  );
}