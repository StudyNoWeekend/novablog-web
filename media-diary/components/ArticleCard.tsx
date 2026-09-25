"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

/** 文章卡片：横向封面 + 标题 + 摘要 + 元信息（列表页与首页通用） */
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-background-soft">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-4xl text-text-subtle">
            {article.category_name || "专栏"}
          </div>
        )}
        {article.is_top && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-ink">
            置顶
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {article.category_name && (
          <span className="mb-2 w-fit rounded-full bg-accent-subtle px-2.5 py-0.5 text-[11px] font-medium text-accent-hover">
            {article.category_name}
          </span>
        )}
        <h3 className="line-clamp-2 font-display text-base leading-snug text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-muted">
            {article.summary}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 text-xs text-text-subtle">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
            {formatDate(article.published_at || article.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
            {article.view_count}
          </span>
          {article.comment_count > 0 && (
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
              {article.comment_count}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
