import { Suspense } from "react";
import type { Metadata } from "next";
import { OpenSourceListContent } from "@/components/OpenSourceListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "开源作品",
  description: "开源作品：把造的轮子与写的工具都摆在这里",
};

export default async function OpenSourcePage() {
  const config = await getModuleConfig();
  if (!config.open_source_enabled) {
    return <ModuleDisabled moduleLabel="开源作品" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="开源作品"
        subtitle="造过的轮子 · 写过的工具 · 点过的 Star，都在这里"
      />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          </div>
        }
      >
        <OpenSourceListContent />
      </Suspense>
    </div>
  );
}
