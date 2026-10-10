import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { travels, getModuleConfig, type TravelGuideDetail } from "@/lib/api";
import { TravelDetailPage } from "@/components/travel-detail-page";
import { ModuleDisabled } from "@/components/module-disabled";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await travels.list({ page: 1, page_size: 100 });
    if (!res.list.length) return [{ id: FALLBACK_ID }];
    return res.list.map((travel) => ({ id: travel.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

async function fetchTravel(id: string): Promise<TravelGuideDetail | null> {
  try {
    return await travels.detail(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "攻略未找到" };
  }
  const data = await fetchTravel(id);
  if (!data) return { title: "旅行攻略" };
  return {
    title: data.title,
    description: data.summary || `${data.title} · ${data.destination}`,
    openGraph: {
      title: data.title,
      description: data.summary || `${data.title} · ${data.destination}`,
      images: data.cover_image ? [data.cover_image] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.travel_enabled) {
    return <ModuleDisabled moduleLabel="旅行攻略" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const data = await fetchTravel(id);
  if (!data) notFound();

  // 更多攻略：热门接口，排除当前攻略取前 3
  let moreTravels: Awaited<ReturnType<typeof travels.hot>> = [];
  try {
    const hot = await travels.hot(4);
    moreTravels = hot.filter((item) => item.id !== data.id).slice(0, 3);
  } catch {
    moreTravels = [];
  }

  return <TravelDetailPage travel={data} moreTravels={moreTravels} />;
}
