import { Suspense } from "react";
import type { Metadata } from "next";
import { VideosListContent } from "@/components/VideosListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "作品展示",
  description: "视频作品展示：Vlog、记录与创作合集",
};

export default async function WorksPage() {
  const config = await getModuleConfig();
  if (!config.video_enabled) {
    return <ModuleDisabled moduleLabel="作品展示" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="作品展示"
        subtitle="Vlog · 旅行 · 记录 · 剪辑教程，用镜头讲述生活的更多可能"
      />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[16/11] animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          </div>
        }
      >
        <VideosListContent />
      </Suspense>
    </div>
  );
}
