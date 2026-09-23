"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDate, formatViewCount } from "@/lib/format";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate =
    formatDate(article.published_at) || formatDate(article.created_at);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(100%_120%_at_50%_0%,#1d2f26_0%,#16211c_70%)]">
            <span className="font-[var(--font-script)] text-3xl text-accent/50">♪</span>
          </div>
        )}
        {article.category_name && (
          <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-accent backdrop-blur-sm">
            {article.category_name}
          </span>
        )}
        {article.is_top && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-on-accent">
            置顶
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-[17px] font-bold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-text-muted">
            {article.summary}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 text-xs text-text-subtle">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
              {formattedDate}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="tabular-nums">{formatViewCount(article.view_count)}</span>
            阅读
          </span>
        </div>
      </div>
    </Link>
  );
}
