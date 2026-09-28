import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { openSources, getModuleConfig, type OpenSourceDetail } from "@/lib/api";
import { OpenSourceDetailPage } from "@/components/open-source-detail-page";
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
    const res = await openSources.list({ page: 1, page_size: 100 });
    if (!res.list.length) return [{ id: FALLBACK_ID }];
    return res.list.map((project) => ({ id: project.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

async function fetchProject(id: string): Promise<OpenSourceDetail | null> {
  try {
    return await openSources.detail(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "项目未找到" };
  }
  const data = await fetchProject(id);
  if (!data) return { title: "开源作品" };
  return {
    title: data.name,
    description: data.summary,
  };
}

export default async function Page({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.open_source_enabled) {
    return <ModuleDisabled moduleLabel="开源作品" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const data = await fetchProject(id);
  if (!data) notFound();
  return <OpenSourceDetailPage project={data} />;
}
