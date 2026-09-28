import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games, getModuleConfig, type GameDetail } from "@/lib/api";
import { GameDetailPage } from "@/components/game-detail-page";
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
    const res = await games.list({ page: 1, page_size: 100 });
    if (!res.list.length) return [{ id: FALLBACK_ID }];
    return res.list.map((game) => ({ id: game.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

async function fetchGame(id: string): Promise<GameDetail | null> {
  try {
    return await games.detail(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "游戏未找到" };
  }
  const data = await fetchGame(id);
  if (!data) return { title: "游戏库" };
  return {
    title: data.title,
    description: `${data.title} · ${data.platform}`,
    openGraph: {
      title: data.title,
      description: `${data.title} · ${data.platform}`,
      images: data.cover ? [data.cover] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.game_enabled) {
    return <ModuleDisabled moduleLabel="游戏库" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const data = await fetchGame(id);
  if (!data) notFound();
  return <GameDetailPage game={data} />;
}
