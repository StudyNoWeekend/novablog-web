"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, MessageCircle, ImageIcon, Tag } from "lucide-react";
import { articles, ArticleDetail } from "@/lib/api";
import { Comments } from "./comments";

interface ArticleDetailPageProps {
  article: ArticleDetail;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

export function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  useEffect(() => {
    articles.view(article.slug).catch(() => {});
  }, [article.slug]);

  return (
    <article className="bg-background">
      {article.cover_image ? (
        <div className="relative aspect-[21/9] w-full bg-muted md:aspect-[21/8]">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded-md cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          返回文章
        </Link>

        <header className="mt-8">
          <h1 className="font-heading text-3xl font-normal leading-tight text-foreground md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {article.category_name && (
              <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                {article.category_name}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatDate(article.published_at || article.created_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-4" />
              {article.view_count} 阅读
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="size-4" />
              {article.comment_count} 评论
            </span>
          </div>
          {article.tag_names && article.tag_names.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag className="size-4 text-muted-foreground" />
              {article.tag_names.map((tag) => (
                <Link
                  key={tag}
                  href={`/articles?tag=${encodeURIComponent(tag)}`}
                  className="rounded text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {article.summary && (
          <p className="mt-8 border-l-2 border-primary pl-5 text-lg italic leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
        )}

        {article.content ? (
          <div
            className="article-body mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <div className="mt-16 rounded-2xl border border-border bg-card py-20 text-center">
            <ImageIcon className="mx-auto size-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">暂无正文内容</p>
          </div>
        )}

        {article.is_comment && (
          <div className="mt-16 border-t border-border pt-12">
            <Comments targetType="article" targetId={article.id} />
          </div>
        )}
      </div>
    </article>
  );
}
