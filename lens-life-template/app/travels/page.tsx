import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { TravelsListContent } from "@/components/TravelsListContent";

export default async function TravelsPage() {
  const config = await getModuleConfig();
  if (!config.travel_enabled) {
    return <ModuleDisabled moduleLabel="旅行攻略" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-playfair)] text-4xl font-bold text-text-primary md:text-5xl">
            旅行攻略
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            从雪山到大海，从城市到旷野。每一份攻略，都是用脚步丈量过的路线。
          </p>

          {/* Keyword Search（纯 HTML GET 表单，静态托管可用） */}
          <form
            action="/travels"
            method="GET"
            className="mx-auto mt-8 flex max-w-md items-center"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="keyword"
                placeholder="搜索目的地、标题..."
                aria-label="搜索旅行攻略"
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-background transition-colors duration-200 ease-out hover:bg-accent-hover"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      {/* Filters + Travel List（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <section className="flex-1 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="h-72 animate-pulse rounded-radius-md bg-surface md:h-96" />
            </div>
          </section>
        }
      >
        <TravelsListContent />
      </Suspense>
    </div>
  );
}
