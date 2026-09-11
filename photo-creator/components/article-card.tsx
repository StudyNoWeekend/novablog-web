"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, ImageIcon, MessageCircle } from "lucide-react";
import type { Article } from "@/lib/api";

interface ArticleCardProps {
  article: Article;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border/80 hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-10" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading line-clamp-2 text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {article.category_name && (
            <span className="rounded-full border border-border bg-muted px-2 py-1 text-foreground">
              {article.category_name}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            {formatDate(article.published_at || article.created_at)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" />
            {article.view_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="size-3.5" />
            {article.comment_count}
          </span>
        </div>
        {article.tag_names && article.tag_names.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tag_names.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
