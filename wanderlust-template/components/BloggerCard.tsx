import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Send } from "lucide-react";
import type { BloggerProfile } from "@/lib/api/blogger";

/**
 * 首页侧栏博主卡（UI 图右上）：头像 + 问候 + 简介 + 标签 + 关于我按钮 + 手账签名区。
 */
export function BloggerCard({ profile }: { profile: BloggerProfile | null }) {
  if (!profile) {
    return (
      <div className="h-96 animate-pulse rounded-radius-lg bg-surface shadow-card" />
    );
  }

  const tags = profile.tags ?? [];

  return (
    <div className="rounded-radius-lg border border-border bg-surface p-5 shadow-card">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-accent/20 bg-background-soft">
          {profile.avatar && (
            <Image
              src={profile.avatar}
              alt={profile.nickname}
              fill
              sizes="64px"
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 font-display text-xl text-text-primary">
            Hi，我是{profile.nickname || "旅行者"}
            <Heart className="h-4 w-4 fill-accent text-accent" strokeWidth={0} />
          </h2>
          {profile.bio && (
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-background-soft px-3 py-1 text-xs text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* About button（笔刷底） */}
      <Link
        href="/about"
        className="brush-bg-strong mt-5 inline-flex min-h-11 -rotate-2 cursor-pointer items-center gap-2 px-7 text-sm font-medium tracking-wide text-white shadow-card transition-all duration-300 ease-out hover:rotate-0 hover:shadow-card-hover"
      >
        关于我
        <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
      </Link>

      {/* Quote（手账签名区） */}
      <div className="brush-bg relative mt-5 -rotate-1 p-5">
        <p className="font-display text-lg leading-relaxed text-accent">
          世界很大，
          <br />
          而你，值得去看看
          <Send className="ml-1 inline h-4 w-4 -rotate-12" strokeWidth={1.6} />
        </p>
        {/* 山形小涂鸦 */}
        <svg
          viewBox="0 0 64 24"
          aria-hidden="true"
          className="absolute bottom-2.5 right-3 w-14 text-accent/50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 21 L16 5 L26 15 L36 3 L50 21" />
          <path d="M44 21 L54 11 L62 21" />
        </svg>
      </div>
    </div>
  );
}
