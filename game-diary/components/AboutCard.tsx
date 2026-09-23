"use client";

import Link from "next/link";
import { Gamepad2, Mail, UserRound } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";

interface AboutCardProps {
  profile: BloggerProfile | null;
  stats: {
    articles: number;
    videos: number;
    games: number;
  };
}

export function AboutCard({ profile, stats }: AboutCardProps) {
  const email = profile?.email;

  return (
    <aside className="overflow-hidden rounded-radius-md border border-border bg-surface shadow-card">
      {/* Card header */}
      <div className="flex items-center gap-2.5 border-b border-border bg-background-soft px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-theme">
          <Gamepad2 className="h-4.5 w-4.5 text-white" strokeWidth={1.8} />
        </span>
        <h2 className="font-heading text-base font-bold text-text-primary">
          关于我
        </h2>
        <span className="ml-auto font-heading text-sm italic text-accent-hover">
          一起玩游戏吧！
        </span>
      </div>

      <div className="p-5">
        {/* Profile head */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-accent/40 shadow-glow">
            {profile?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt={profile.nickname}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-elevated text-text-subtle">
                <UserRound className="h-6 w-6" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-heading text-lg font-extrabold text-text-primary">
                {profile?.nickname || "游戏博主"}
              </h3>
              <span className="shrink-0 rounded-full bg-gradient-theme px-2 py-0.5 text-[10px] font-bold text-white">
                游戏博主
              </span>
            </div>
            {profile?.city && (
              <p className="mt-0.5 text-xs text-text-subtle">{profile.city}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          {profile?.bio || "热爱游戏，也热爱生活。"}
        </p>

        {/* Tags as bullet list */}
        {profile?.tags && profile.tags.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm text-text-muted">
            {profile.tags.slice(0, 4).map((tag) => (
              <li key={tag} className="flex items-start gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="min-w-0 break-words">{tag}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Email */}
        {email && (
          <a
            href={`mailto:${email}`}
            className="mt-4 flex cursor-pointer items-center gap-2 break-all text-sm text-text-muted transition-colors duration-200 hover:text-accent-hover"
          >
            <Mail className="h-4 w-4 shrink-0 text-text-subtle" strokeWidth={1.5} />
            合作联系：{email}
          </a>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-border border-t border-border pt-5 text-center">
          <div>
            <p className="font-heading text-xl font-extrabold text-text-primary">
              {stats.articles}
            </p>
            <p className="mt-0.5 text-xs text-text-subtle">原创文章</p>
          </div>
          <div>
            <p className="font-heading text-xl font-extrabold text-text-primary">
              {stats.videos}
            </p>
            <p className="mt-0.5 text-xs text-text-subtle">视频作品</p>
          </div>
          <div>
            <p className="font-heading text-xl font-extrabold text-text-primary">
              {stats.games}
            </p>
            <p className="mt-0.5 text-xs text-text-subtle">游戏收录</p>
          </div>
        </div>

        <Link
          href="/about"
          className="mt-5 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background-soft text-sm font-bold text-text-secondary transition-colors duration-200 ease-out hover:border-accent hover:text-accent-hover"
        >
          了解更多
        </Link>
      </div>
    </aside>
  );
}
