"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const dateStr = article.published_at || article.created_at;
  const formattedDate = formatDate(dateStr);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Cover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-background-soft">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-hand text-3xl text-text-subtle">yum!</span>
          </div>
        )}
        {/* 分类角标 */}
        {article.category_name && (
          <span className="absolute bottom-3 left-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-white shadow-card">
            {article.category_name}
          </span>
        )}
        {article.is_top && (
          <span className="absolute right-3 top-3 rounded-full bg-berry px-2.5 py-1 text-[11px] font-medium text-white shadow-card">
            置顶
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
          {article.title}
        </h3>
        {article.summary && (
          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
            {article.summary}
          </p>
        )}
        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-text-subtle">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
              {formattedDate}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
            {article.view_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
