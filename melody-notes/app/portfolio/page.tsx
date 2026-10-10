import { Suspense } from "react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PortfoliosListContent } from "@/components/PortfoliosListContent";

export const metadata = { title: "作品集" };

export default async function PortfolioPage() {
  const config = await getModuleConfig();
  if (!config.portfolio_enabled) {
    return <ModuleDisabled moduleLabel="作品集" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
            作品集
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
            每一帧画面，都是生活里的一段旋律。
          </p>
        </div>
      </section>

      {/* Portfolio List（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <section className="flex-1 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="h-72 animate-pulse rounded-xl bg-surface md:h-96" />
            </div>
          </section>
        }
      >
        <PortfoliosListContent />
      </Suspense>
    </div>
  );
}
