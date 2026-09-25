import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Eye, MessageCircle } from "lucide-react";
import {
  getArticleBySlug,
  getArticles,
  getRandomArticles,
} from "@/lib/api/articles";
import { getModuleConfig } from "@/lib/api/module-config";
import { ArticleCard } from "@/components/ArticleCard";
import { Comments } from "@/components/Comments";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { ArticleViewTracker } from "@/components/ViewTracker";
import { formatDate } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 后端不可达时的构建占位 slug（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_SLUG = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const res = await getArticles({ page: 1, page_size: 100 });
  if (res.list.length === 0) return [{ slug: FALLBACK_SLUG }];
  return res.list.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (slug === FALLBACK_SLUG) {
    return { title: "动态未找到" };
  }
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "动态未找到" };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.article_enabled) {
    return <ModuleDisabled moduleLabel="创作动态" />;
  }

  const { slug } = await params;
  if (slug === FALLBACK_SLUG) {
    notFound();
  }
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRandomArticles(4);
  const filteredRelated = relatedArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/articles"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent-hover"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回创作动态
        </Link>
      </div>

      {/* Full-width cover with overlaid title */}
      {article.cover_image ? (
        <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative aspect-[21/9] overflow-hidden rounded-radius-lg border-2 border-ink shadow-card">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              {article.category_name && (
                <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-ink">
                  {article.category_name}
                </span>
              )}
              <h1 className="max-w-3xl font-display text-2xl leading-tight text-white md:text-4xl">
                {article.title}
              </h1>
            </div>
          </div>
        </header>
      ) : (
        <header className="mx-auto w-full max-w-3xl px-4 pt-4 sm:px-6 lg:px-8">
          {article.category_name && (
            <span className="mb-3 inline-block rounded-full border border-accent bg-accent-subtle px-3 py-1 text-xs font-medium text-accent-hover">
              {article.category_name}
            </span>
          )}
          <h1 className="font-display text-3xl leading-tight text-text-primary md:text-4xl">
            {article.title}
          </h1>
        </header>
      )}

      {/* Meta + Content column */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        {/* 浏览计数客户端上报（静态导出后服务端计数失效） */}
        <ArticleViewTracker slug={article.slug} />

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
            {formatDate(article.published_at || article.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
            {article.view_count} 次阅读
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
            {article.comment_count} 条评论
          </span>
        </div>

        {/* Tags */}
        {article.tag_names && article.tag_names.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {article.tag_names.map((tag) => (
              <Link
                key={tag}
                href={`/articles?keyword=${encodeURIComponent(tag)}`}
                className="min-h-8 cursor-pointer rounded-full border border-accent/40 bg-accent-subtle px-3 py-0.5 text-xs text-accent-hover transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Summary quote */}
        {article.summary && (
          <blockquote className="mt-8 rounded-r-radius-sm border-l-[3px] border-accent bg-surface-highlight py-2.5 pl-4 text-base leading-relaxed text-text-muted md:pl-5">
            {article.summary}
          </blockquote>
        )}

        {/* Content */}
        <article className="prose-content mt-8">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Comments */}
        {article.is_comment && (
          <div className="mt-14 border-t border-dashed border-border-strong pt-12">
            <Comments targetType="article" targetId={article.id} />
          </div>
        )}
      </div>

      {/* Related Articles */}
      {filteredRelated.length > 0 && (
        <section className="border-t border-border bg-background-soft py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-display text-2xl text-text-primary">
              推荐阅读
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRelated.map((relArticle) => (
                <ArticleCard key={relArticle.id} article={relArticle} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
