import { Suspense } from "react";
import type { Metadata } from "next";
import { PortfoliosListContent } from "@/components/PortfoliosListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "作品集",
  description: "摄影作品集：每一次快门，都是生活的定格",
};

export default async function PortfolioPage() {
  const config = await getModuleConfig();
  if (!config.portfolio_enabled) {
    return <ModuleDisabled moduleLabel="作品集" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="作品集"
        subtitle="摄影 · 调色 · 创作，每一次快门都是生活的定格"
      />

      {/* 作品集列表（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          </div>
        }
      >
        <PortfoliosListContent />
      </Suspense>
    </div>
  );
}
