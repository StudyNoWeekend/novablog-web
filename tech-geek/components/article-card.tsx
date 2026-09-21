import Link from "next/link";
import Image from "next/image";
import { Eye, MessageCircle, Folder, ArrowUp } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Article } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const href = `/articles/${article.slug}`;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.2)] focus-within:ring-2 focus-within:ring-ring ${
        featured ? "md:flex-row" : ""
      }`}
    >
      {article.cover_image && (
        <Link
          href={href}
          className={`relative block overflow-hidden bg-muted ${
            featured ? "aspect-[16/10] md:w-2/5 md:aspect-auto md:min-h-[220px]" : "aspect-[16/10]"
          }`}
        >
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            unoptimized
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <Badge
            variant="outline"
            className="border-border font-mono text-primary hover:border-primary/50"
            asChild
          >
            <Link href={`/articles?category_id=${article.category_id}`}>
              <Folder className="mr-1 h-3 w-3" />
              {article.category_name}
            </Link>
          </Badge>
          {article.is_top && (
            /* 本仓库 Badge 非 asChild 用法会丢弃 children，置顶徽章用普通 span 实现 */
            <span className="inline-flex h-5 items-center gap-0.5 rounded-4xl bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
              置顶
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          <Link href={href} className="focus-visible:outline-none">
            {article.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {article.summary}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{article.published_at ? format(new Date(article.published_at), "yyyy-MM-dd", { locale: zhCN }) : ""}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {article.view_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {article.comment_count}
            </span>
          </div>

          {article.tag_names.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tag_names.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/articles?tag=${encodeURIComponent(tag)}`}
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-primary"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
