"use client";

import Link from "next/link";
import { Github, Star } from "lucide-react";
import type { OpenSource } from "@/lib/types";

interface OpenSourceCardProps {
  item: OpenSource;
}

/** 解析逗号分隔的 topics 字符串 */
function parseTopics(topics: string): string[] {
  return String(topics || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function OpenSourceCard({ item }: OpenSourceCardProps) {
  const topics = parseTopics(item.topics);

  return (
    <Link
      href={`/open-source/${item.id}`}
      className="group flex cursor-pointer flex-col rounded-radius-lg bg-surface p-5 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* 标题 + Star 数 */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex min-w-0 items-center gap-2 font-display text-lg leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent">
          <Github className="h-4.5 w-4.5 shrink-0 text-text-muted" strokeWidth={1.5} />
          <span className="truncate">{item.name}</span>
        </h3>
        {item.stars > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-text-muted">
            <Star className="h-3.5 w-3.5 fill-flame text-flame" strokeWidth={0} />
            {item.stars.toLocaleString()}
          </span>
        )}
      </div>

      {/* 简介 */}
      {item.summary && (
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {item.summary}
        </p>
      )}

      {/* 语言 + topics 标签 */}
      <div className="mt-4 flex flex-1 flex-wrap content-end items-center gap-1.5 border-t border-border pt-3">
        {item.language && (
          <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent">
            {item.language}
          </span>
        )}
        {topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-background-soft px-2 py-0.5 text-xs text-text-muted"
          >
            {topic}
          </span>
        ))}
      </div>
    </Link>
  );
}
