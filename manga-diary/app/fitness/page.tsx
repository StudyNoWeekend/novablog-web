import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { FitnessListContent } from "@/components/FitnessListContent";

export const metadata = {
  title: "健身训练",
};

export default async function FitnessPage() {
  const config = await getModuleConfig();
  if (!config.fitness_enabled) {
    return <ModuleDisabled moduleLabel="健身训练" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-hand text-2xl text-accent-hover">Training Log</p>
          <h1 className="mt-1 font-display text-4xl text-text-primary md:text-5xl">
            健身训练
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            画累了就动一动，这里是挥洒汗水的时间线
          </p>

          {/* Keyword Search（纯 HTML GET 表单，静态托管可用） */}
          <form action="/fitness" method="GET" className="mx-auto mt-8 flex max-w-md items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="keyword"
                placeholder="搜索训练标题..."
                aria-label="搜索训练记录"
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-ink px-5 text-sm font-medium text-accent transition-colors duration-200 ease-out hover:bg-ink-soft"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      {/* Type Filter + Fitness List（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <section className="flex-1 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="h-72 animate-pulse rounded-radius-md border border-border bg-background-soft md:h-96" />
            </div>
          </section>
        }
      >
        <FitnessListContent />
      </Suspense>
    </div>
  );
}
