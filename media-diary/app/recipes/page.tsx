import { Suspense } from "react";
import type { Metadata } from "next";
import { RecipesListContent } from "@/components/RecipesListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "美食菜谱",
  description: "美食菜谱：从深夜拌面到周末炖菜的厨房记录",
};

export default async function RecipesPage() {
  const config = await getModuleConfig();
  if (!config.recipe_enabled) {
    return <ModuleDisabled moduleLabel="美食菜谱" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="美食菜谱"
        subtitle="锅铲与镜头都要拿稳，把好吃的做法一步步记下来"
      />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          </div>
        }
      >
        <RecipesListContent />
      </Suspense>
    </div>
  );
}
