import { Suspense } from "react";
import type { Metadata } from "next";
import { ArticlesListContent } from "@/components/ArticlesListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "内容专栏",
  description: "图文专栏：生活随笔、经验干货与创作思考",
};

export default async function ArticlesPage() {
  const config = await getModuleConfig();
  if (!config.article_enabled) {
    return <ModuleDisabled moduleLabel="内容专栏" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="内容专栏"
        subtitle="生活随笔 · 好物推荐 · 经验干货，用文字记录思考与灵感"
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
        <ArticlesListContent />
      </Suspense>
    </div>
  );
}
