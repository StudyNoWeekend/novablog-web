"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, MessageCircle, Pin } from "lucide-react";
import type { Article } from "@/lib/types";

/** 数字缩写：>=1万 显示 x.x万，>=1000 显示 x.xk（同参考图 8.2k 风格） */
export function formatCount(n: number): string {
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}万`;
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  return String(n);
}

export function formatArticleDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 分类徽章配色：按分类 id 末位在粉/紫/蓝/绿间循环，呼应参考图的马卡龙徽章 */
const BADGE_STYLES = [
  "bg-accent-subtle text-accent-hover",
  "bg-lav-subtle text-lav-hover",
  "bg-sky-subtle text-sky",
  "bg-mint-subtle text-mint",
];

export function categoryBadgeStyle(categoryId: string): string {
  const last = categoryId.slice(-1);
  const idx = parseInt(last, 16);
  return BADGE_STYLES[Number.isNaN(idx) ? 0 : idx % BADGE_STYLES.length];
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-background-soft">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-subtle">
            <span className="font-heading text-sm">暂无封面</span>
          </div>
        )}
        {article.category_name && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm ${categoryBadgeStyle(article.category_id)}`}
          >
            {article.category_name}
          </span>
        )}
        {article.is_top && (
          <span className="absolute right-3 top-3 flex h-6 items-center gap-1 rounded-full bg-accent px-2 text-[11px] font-medium text-white">
            <Pin className="h-3 w-3" strokeWidth={2} />
            置顶
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1.5 line-clamp-2 font-heading text-base leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
          {article.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-text-muted">
          {article.summary}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-text-subtle">
          <span className="flex shrink-0 items-center gap-1">
            <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
            {formatArticleDate(article.published_at || article.created_at)}
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
              {formatCount(article.view_count)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
              {formatCount(article.comment_count)}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
