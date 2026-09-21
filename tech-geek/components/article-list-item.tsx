import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUp, Calendar, Eye, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Article } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

/** 后端返回 RFC3339 时间；对空值/非法值兜底，避免 format 抛错导致整页崩溃 */
function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : format(date, "yyyy-MM-dd", { locale: zhCN });
}

/** 首页「最新文章」横向卡片：封面居左，内容居右（对应设计稿布局） */
export function ArticleListItem({ article }: { article: Article }) {
  const href = `/articles/${article.slug}`;

  return (
    <article className="group relative flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-ring sm:flex-row">
      {article.cover_image && (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block aspect-video w-full shrink-0 overflow-hidden rounded-md bg-muted sm:w-44 md:w-48"
        >
          <Image
            src={article.cover_image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 192px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        </Link>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {article.category_name && (
            <Badge
              asChild
              className="cursor-pointer border-transparent bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            >
              <Link href={`/articles?category_id=${article.category_id}`}>
                {article.category_name}
              </Link>
            </Badge>
          )}
          {article.is_top && (
            /* 本仓库 Badge 非 asChild 用法会丢弃 children，置顶徽章用普通 span 实现 */
            <span className="inline-flex h-5 shrink-0 items-center gap-0.5 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
              置顶
            </span>
          )}
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-semibold tracking-tight text-foreground md:text-lg">
          <Link
            href={href}
            className="rounded transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {article.title}
          </Link>
        </h3>

        {article.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(article.published_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            {article.view_count}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {article.comment_count}
          </span>
          <Link
            href={href}
            className="ml-auto hidden items-center gap-1 rounded font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex"
          >
            阅读更多
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
