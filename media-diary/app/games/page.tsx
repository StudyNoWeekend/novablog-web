import { Suspense } from "react";
import type { Metadata } from "next";
import { GamesListContent } from "@/components/GamesListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "游戏库",
  description: "游戏库：想玩的、在玩的与玩过的游戏都在这里",
};

export default async function GamesPage() {
  const config = await getModuleConfig();
  if (!config.game_enabled) {
    return <ModuleDisabled moduleLabel="游戏库" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="游戏库"
        subtitle="剪辑之余也要喘口气，游戏是另一种讲故事的方式"
      />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          </div>
        }
      >
        <GamesListContent />
      </Suspense>
    </div>
  );
}
