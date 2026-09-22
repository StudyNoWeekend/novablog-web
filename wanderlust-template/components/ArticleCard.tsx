import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatCount, formatDate } from "@/lib/format";

interface ArticleCardProps {
  article: Article;
  authorName?: string;
  authorAvatar?: string;
}

export function ArticleCard({
  article,
  authorName,
  authorAvatar,
}: ArticleCardProps) {
  const dateStr = formatDate(article.published_at || article.created_at);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-lg bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-background-soft">
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
          <div className="flex h-full items-center justify-center text-text-subtle">
            <span className="font-hand text-lg">No Photo ~</span>
          </div>
        )}
        {article.category_name && (
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm">
            {article.category_name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-[15px] font-semibold text-text-primary transition-colors duration-200 group-hover:text-accent">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-1.5 line-clamp-1 text-sm text-text-muted">
            {article.summary}
          </p>
        )}

        {/* Footer */}
        <div className="mt-4 border-t border-border pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5 text-xs text-text-muted">
              {authorAvatar ? (
                <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={authorAvatar}
                    alt={authorName || ""}
                    fill
                    sizes="20px"
                    className="object-cover"
                  />
                </span>
              ) : null}
              <span className="truncate">{authorName || ""}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-xs text-text-muted">
              <Heart className="h-3.5 w-3.5 text-flame" strokeWidth={1.8} />
              {formatCount(article.view_count)}
            </span>
          </div>
          {dateStr && (
            <p className="mt-1 text-xs text-text-subtle">{dateStr}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
