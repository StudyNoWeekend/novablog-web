import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, ArticleDetail } from "@/lib/api";
import { ArticleDetailPage } from "@/components/article-detail-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function timeoutSignal(ms = 3000) {
  return AbortSignal.timeout(ms);
}

export async function generateStaticParams() {
  try {
    const res = await articles.list(
      { page: 1, page_size: 20 },
      { signal: timeoutSignal() }
    );
    if (!res.list.length) return [{ slug: "demo" }];
    return res.list.map((item) => ({ slug: item.slug }));
  } catch {
    return [{ slug: "demo" }];
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
  const data = await fetchArticle(slug);
  if (!data) notFound();
  return <ArticleDetailPage article={data} />;
}
