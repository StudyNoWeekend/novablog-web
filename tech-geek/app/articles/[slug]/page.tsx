import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/lib/api";
import { ArticleDetailClient } from "@/components/article-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

// 后端不可达时的构建占位 slug（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_SLUG = "__fallback__";

export async function generateStaticParams() {
  try {
    const res = await articles.list({ page: 1, page_size: 100 });
    return res.list.map((article) => ({ slug: article.slug }));
  } catch {
    return [{ slug: FALLBACK_SLUG }];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === FALLBACK_SLUG) {
    return { title: "文章未找到", description: "请求的文章不存在或已下架。" };
  }
  try {
    const article = await articles.detail(slug);
    return {
      title: article.title,
      description: article.summary,
      openGraph: {
        title: article.title,
        description: article.summary,
        images: article.cover_image ? [article.cover_image] : undefined,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.summary,
        images: article.cover_image ? [article.cover_image] : undefined,
      },
    };
  } catch {
    return {
      title: "文章未找到",
      description: "请求的文章不存在或已下架。",
    };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  if (slug === FALLBACK_SLUG) {
    notFound();
  }
  try {
    const article = await articles.detail(slug);
    return <ArticleDetailClient article={article} />;
  } catch {
    notFound();
  }
}
