"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, MessageCircle, Folder, Tag, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { articles, ArticleDetail, Article } from "@/lib/api";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Comments } from "@/components/comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/article-card";

interface ArticleDetailClientProps {
  article: ArticleDetail;
}

export function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const [related, setRelated] = useState<Article[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    Promise.all([
      articles.view(article.slug).catch(() => null),
      articles.random(4).then((res) => {
        setRelated(res.filter((a) => a.id !== article.id).slice(0, 3));
      }).catch(() => setRelated([])),
    ]).finally(() => setLoadingRelated(false));
  }, [article]);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-6 cursor-pointer">
        <Link href="/articles">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回文章列表
        </Link>
      </Button>

      <header>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-border font-mono text-primary" asChild>
            <Link href={`/articles?category_id=${article.category_id}`}>
              <Folder className="mr-1 h-3 w-3" />
              {article.category_name}
            </Link>
          </Badge>
          {article.is_top && (
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">
              置顶
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {article.title}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">{article.summary}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {article.published_at
              ? format(new Date(article.published_at), "yyyy-MM-dd", { locale: zhCN })
              : format(new Date(article.created_at), "yyyy-MM-dd", { locale: zhCN })}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {article.view_count} 阅读
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            {article.comment_count} 评论
          </span>
        </div>

        {article.tag_names.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tag_names.map((tag) => (
              <Link
                key={tag}
                href={`/articles?tag=${encodeURIComponent(tag)}`}
                className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {article.cover_image && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg border border-border">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="mt-10">
        <MarkdownRenderer content={article.content} />
      </div>

      {loadingRelated ? (
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="mb-6 text-xl font-bold text-foreground">相关推荐</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      ) : related.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="mb-6 text-xl font-bold text-foreground">相关推荐</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}

      <Comments targetType="article" targetId={article.id} />
    </article>
  );
}
