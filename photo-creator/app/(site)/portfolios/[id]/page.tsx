import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolios, PortfolioDetail } from "@/lib/api";
import { PortfolioDetailPage } from "@/components/portfolio-detail-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

function timeoutSignal(ms = 3000) {
  return AbortSignal.timeout(ms);
}

export async function generateStaticParams() {
  try {
    const res = await portfolios.list(
      { page: 1, page_size: 20 },
      { signal: timeoutSignal() }
    );
    if (!res.list.length) return [{ id: "demo" }];
    return res.list.map((item) => ({ id: item.id }));
  } catch {
    return [{ id: "demo" }];
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
  const data = await fetchPortfolio(id);
  if (!data) notFound();
  return <PortfolioDetailPage portfolio={data} />;
}
