import { Suspense } from "react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { RecipesListContent } from "@/components/RecipesListContent";

export const metadata = { title: "菜谱分享" };

export default async function RecipesPage() {
  const config = await getModuleConfig();
  if (!config.article_enabled) {
    return <ModuleDisabled moduleLabel="菜谱分享" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-hand text-2xl text-accent">Recipes &amp; Love</p>
          <h1 className="squiggle mx-auto mt-2 inline-block font-display text-4xl text-text-primary md:text-5xl">
            菜谱分享
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted">
            把好吃的做法写下来，等你来厨房一起试试
          </p>
        </div>
      </section>

      {/* Recipe Grid（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <section className="flex-1 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3.6] animate-pulse rounded-lg bg-surface"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <RecipesListContent />
      </Suspense>
    </div>
  );
}
