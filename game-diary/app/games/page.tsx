import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { GamesListContent } from "@/components/GamesListContent";

export const metadata = { title: "游戏库" };

export default async function GamesPage() {
  const config = await getModuleConfig();
  if (!config.equipment_enabled) {
    return <ModuleDisabled moduleLabel="游戏库" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-black text-text-primary md:text-5xl">
            游戏<span className="text-gradient">库</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            博主收藏的游戏作品与简评，正在游玩 / 已通关 / 白金纪念
          </p>

          {/* Keyword Search（纯 HTML GET 表单，静态托管可用） */}
          <form
            action="/games"
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
                placeholder="搜索游戏名称..."
                aria-label="搜索游戏"
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-gradient-theme px-5 text-sm font-bold text-white transition-opacity duration-200 ease-out hover:opacity-90"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      {/* Game List（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <section className="flex-1 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[16/13] animate-pulse rounded-radius-md bg-surface"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <GamesListContent />
      </Suspense>
    </div>
  );
}
