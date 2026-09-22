import Link from "next/link";
import { Flame, Heart } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatCount } from "@/lib/format";

/**
 * 首页侧栏热门文章榜（UI 图右下）：编号徽标 + 标题 + 心形计数。
 */
export function HotArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="热门文章"
      className="rounded-radius-lg border border-border bg-surface p-5 shadow-card"
    >
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-text-primary">
        <Flame className="h-5 w-5 text-flame" strokeWidth={1.8} />
        热门文章
      </h2>
      <ol className="space-y-3.5">
        {articles.map((article, index) => (
          <li key={article.id}>
            <Link
              href={`/articles/${article.slug}`}
              className="group flex items-center gap-3"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                  index < 3
                    ? "bg-flame text-white"
                    : "bg-background-soft text-text-subtle"
                }`}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-text-secondary transition-colors duration-200 group-hover:text-accent">
                {article.title}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs text-text-subtle">
                <Heart className="h-3.5 w-3.5 text-flame/70" strokeWidth={1.6} />
                {formatCount(article.view_count)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
