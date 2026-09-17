import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Eye, MessageCircle, Tag, FolderOpen } from "lucide-react";
import { articles } from "@/lib/api";
import { MarkdownContent } from "@/components/markdown-content";
import { Comments } from "@/components/comments";
import { ArticleActions } from "@/components/article-actions";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

// 后端不可达时的构建占位 slug（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_SLUG = "__fallback__";

export async function generateStaticParams() {
  try {
    const res = await articles.list({ page_size: 100 });
    if (res.list.length === 0) return [{ slug: FALLBACK_SLUG }];
    return res.list.map((article) => ({ slug: article.slug }));
  } catch {
    return [{ slug: FALLBACK_SLUG }];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === FALLBACK_SLUG) {
    return { title: "文章未找到" };
  }
  const article = await articles.detail(slug).catch(() => null);
  if (!article) return { title: "文章未找到" };
  return {
    title: `${article.title} - Media Creator Blog`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  if (slug === FALLBACK_SLUG) {
    notFound();
  }
  const article = await articles.detail(slug).catch(() => null);
  if (!article) notFound();

  return (
    <article className="min-h-screen bg-background py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          返回文章列表
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            {article.category_name && (
              <Link
                href={`/articles?category_id=${article.category_id}`}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FolderOpen className="h-3 w-3" />
                {article.category_name}
              </Link>
            )}
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(article.published_at)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.summary && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{article.summary}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.view_count} 阅读
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {article.comment_count} 评论
              </span>
            </div>
            <ArticleActions slug={slug} />
          </div>
        </header>

        {article.cover_image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border shadow-sm">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        )}

        {article.tag_names && article.tag_names.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tag_names.map((tag) => (
              <Link
                key={tag}
                href={`/articles?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl bg-card p-6 shadow-sm border border-border sm:p-8 lg:p-10">
          <MarkdownContent content={article.content} />
        </div>

        <div className="mt-8">
          <ArticleActions slug={slug} />
        </div>

        <div className="mt-10">
          <Comments targetType="article" targetId={article.id} />
        </div>
      </div>
    </article>
  );
}
