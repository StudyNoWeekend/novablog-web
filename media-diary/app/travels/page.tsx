import { Suspense } from "react";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { TravelsListContent } from "@/components/TravelsListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "旅行",
  description: "旅行攻略：行程安排、景点推荐与避坑经验",
};

export default async function TravelsPage() {
  const config = await getModuleConfig();
  if (!config.travel_enabled) {
    return <ModuleDisabled moduleLabel="旅行" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="旅行"
        subtitle="行程 · 景点 · 避坑经验，把路上的风景整理给你"
      />

      {/* Keyword Search（纯 HTML GET 表单，静态托管可用） */}
      <div className="border-b border-border bg-background">
        <form
          action="/travels"
          method="GET"
          className="mx-auto flex max-w-md items-center px-4 py-6"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
              strokeWidth={1.5}
            />
            <input
              type="search"
              name="keyword"
              placeholder="搜索目的地、攻略标题..."
              aria-label="搜索旅行攻略"
              className="min-h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-accent-hover"
          >
            搜索
          </button>
        </form>
      </div>

      {/* Filters + Travel List（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[16/10] animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          </div>
        }
      >
        <TravelsListContent />
      </Suspense>
    </div>
  );
}
