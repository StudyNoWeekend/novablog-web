"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const dateStr = article.published_at || article.created_at;
  const formattedDate = new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
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
          <div className="flex h-full items-center justify-center bg-background-soft text-text-subtle">
            <span className="text-sm">暂无封面</span>
          </div>
        )}
        {article.is_top && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-theme px-2.5 py-0.5 text-xs font-bold text-white">
            置顶
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-text-muted">
          <span>{formattedDate}</span>
          {article.category_name && (
            <>
              <span className="text-text-subtle">·</span>
              <span className="text-accent-hover">{article.category_name}</span>
            </>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 font-heading text-lg font-bold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
          {article.summary}
        </p>
        {article.tag_names && article.tag_names.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tag_names.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-background-soft px-2 py-0.5 text-xs text-text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
