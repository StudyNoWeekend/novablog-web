import { Suspense } from "react";
import { Search } from "lucide-react";
import { PortfoliosContent } from "./portfolios-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { moduleConfig, ALL_ENABLED } from "@/lib/api";

export const metadata = { title: "作品集" };

export default async function PortfoliosPage() {
  const modules = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!modules.portfolio_enabled) {
    return <ModuleDisabled moduleLabel="作品集" />;
  }

  return (
    <div className="min-h-screen py-10 lg:py-16">
      {/* 页头 + 纯 HTML GET 搜索表单（静态托管可用） */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-hand text-3xl text-foreground sm:text-4xl">作品集</h1>
            <p className="mt-2 text-muted-foreground">把喜欢的画面，整理成一本本画册</p>
          </div>

          <form action="/portfolio" method="GET" className="flex w-full max-w-sm items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="keyword"
                placeholder="搜索作品集名称..."
                aria-label="搜索作品集"
                className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              搜索
            </button>
          </form>
        </div>
      </div>

      {/* 作品集网格（客户端按 searchParams 取数渲染） */}
      <Suspense fallback={<PortfoliosSkeleton />}>
        <PortfoliosContent />
      </Suspense>
    </div>
  );
}

function PortfoliosSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
