import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolios, PortfolioDetail } from "@/lib/api";
import { PortfolioDetailPage } from "@/components/portfolio-detail-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

function timeoutSignal(ms = 3000) {
  return AbortSignal.timeout(ms);
}

export async function generateStaticParams() {
  try {
    const res = await portfolios.list(
      { page: 1, page_size: 20 },
      { signal: timeoutSignal() }
    );
    if (!res.list.length) return [{ id: FALLBACK_ID }];
    return res.list.map((item) => ({ id: item.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

async function fetchPortfolio(id: string): Promise<PortfolioDetail | null> {
  try {
    return await portfolios.detail(id, { signal: timeoutSignal() });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "作品集未找到" };
  }
  const data = await fetchPortfolio(id);
  if (!data) return { title: "作品集" };
  return {
    title: data.name,
    description: data.description,
    openGraph: {
      title: data.name,
      description: data.description,
      images: data.cover_url ? [data.cover_url] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const data = await fetchPortfolio(id);
  if (!data) notFound();
  return <PortfolioDetailPage portfolio={data} />;
}
