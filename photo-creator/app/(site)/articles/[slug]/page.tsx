import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, ArticleDetail } from "@/lib/api";
import { ArticleDetailPage } from "@/components/article-detail-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 后端不可达时的构建占位 slug（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_SLUG = "__fallback__";

function timeoutSignal(ms = 3000) {
  return AbortSignal.timeout(ms);
}

export async function generateStaticParams() {
  try {
    const res = await articles.list(
      { page: 1, page_size: 20 },
      { signal: timeoutSignal() }
    );
    if (!res.list.length) return [{ slug: FALLBACK_SLUG }];
    return res.list.map((item) => ({ slug: item.slug }));
  } catch {
    return [{ slug: FALLBACK_SLUG }];
  }
}

async function fetchArticle(slug: string): Promise<ArticleDetail | null> {
  try {
    return await articles.detail(slug, { signal: timeoutSignal() });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === FALLBACK_SLUG) {
    return { title: "文章未找到" };
  }
  const data = await fetchArticle(slug);
  if (!data) return { title: "文章" };
  return {
    title: data.title,
    description: data.summary,
    openGraph: {
      title: data.title,
      description: data.summary,
      images: data.cover_image ? [data.cover_image] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (slug === FALLBACK_SLUG) {
    notFound();
  }
  const data = await fetchArticle(slug);
  if (!data) notFound();
  return <ArticleDetailPage article={data} />;
}
