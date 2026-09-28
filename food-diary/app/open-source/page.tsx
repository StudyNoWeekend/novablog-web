import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { OpenSourceListContent } from "@/components/OpenSourceListContent";

export const metadata = { title: "开源作品" };

export default async function OpenSourcePage() {
  const config = await getModuleConfig();
  if (!config.open_source_enabled) {
    return <ModuleDisabled moduleLabel="开源作品" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-hand text-2xl text-accent">Open Source ♡</p>
          <h1 className="squiggle mx-auto mt-2 inline-block font-display text-4xl text-text-primary md:text-5xl">
            开源作品
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted">
            把折腾过的项目摆在货架上，欢迎来 GitHub 逛逛
          </p>

          {/* Keyword Search（纯 HTML GET 表单，静态托管可用） */}
          <form action="/open-source" method="GET" className="mx-auto mt-8 flex max-w-md items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="keyword"
                placeholder="搜索项目名称、简介..."
                aria-label="搜索开源作品"
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      {/* Open Source List（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <section className="flex-1 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="h-72 animate-pulse rounded-lg bg-surface md:h-96" />
            </div>
          </section>
        }
      >
        <OpenSourceListContent />
      </Suspense>
    </div>
  );
}
