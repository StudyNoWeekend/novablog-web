"use client";

import Link from "next/link";
import { Quote } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";
import { SocialIcons } from "@/components/SocialIcons";

interface BloggerCardProps {
  profile: BloggerProfile | null;
  /** 统计数据（文章总数 / 歌曲总数 / 歌单数），由调用方取数传入 */
  stats?: { articles?: number; songs?: number; playlists?: number };
}

export function BloggerCard({ profile, stats }: BloggerCardProps) {
  if (!profile) return null;

  const statItems = [
    { label: "文章", value: stats?.articles },
    { label: "歌曲", value: stats?.songs },
    { label: "歌单", value: stats?.playlists },
  ];

  return (
    <aside className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <div className="relative h-20 bg-[radial-gradient(120%_160%_at_50%_-20%,#274434_0%,#16211c_70%)]">
        {/* 顶部装饰波纹 */}
        <svg
          viewBox="0 0 400 60"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-8 w-full text-accent/20"
          aria-hidden="true"
        >
          <path
            d="M0 40 Q 50 10 100 35 T 200 30 T 300 40 T 400 25 V 60 H 0 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="-mt-9 flex flex-col items-center px-6 pb-6 text-center">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.nickname}
            className="h-[4.5rem] w-[4.5rem] rounded-full border-2 border-accent/60 object-cover"
          />
        ) : (
          <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-accent/60 bg-surface-elevated text-xl font-bold text-accent">
            {(profile.nickname || "M").slice(0, 1)}
          </div>
        )}
        <h3 className="mt-3 text-lg font-bold text-text-primary">
          {profile.nickname}
        </h3>
        {profile.bio && (
          <p className="mt-1 text-xs leading-relaxed text-text-muted">{profile.bio}</p>
        )}
        {profile.tags && profile.tags.length > 0 && (
          <p className="mt-3 flex items-start gap-1.5 text-left text-[13px] leading-relaxed text-text-secondary">
            <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.5} />
            <span>{profile.tags.slice(0, 3).join(" · ")}</span>
          </p>
        )}

        {/* 统计 */}
        <div className="mt-5 grid w-full grid-cols-3 divide-x divide-border rounded-lg border border-border bg-background-soft py-3">
          {statItems.map((item) => (
            <div key={item.label}>
              <p className="text-sm text-text-subtle">{item.label}</p>
              <p className="mt-0.5 text-base font-bold tabular-nums text-text-primary">
                {typeof item.value === "number" ? item.value : "--"}
              </p>
            </div>
          ))}
        </div>

        {/* 社交 */}
        {profile.social_links?.length > 0 && (
          <div className="mt-5 flex justify-center">
            <SocialIcons links={profile.social_links} />
          </div>
        )}

        <Link
          href="/about"
          className="mt-5 inline-flex min-h-9 w-full cursor-pointer items-center justify-center rounded-full border border-accent/40 text-sm text-accent transition-colors duration-200 hover:bg-accent-subtle"
        >
          了解我 →
        </Link>
      </div>
    </aside>
  );
}
