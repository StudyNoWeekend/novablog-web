import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { ArticlesListContent } from "@/components/ArticlesListContent";

export const metadata = { title: "文章" };

export default async function ArticlesPage() {
  const config = await getModuleConfig();
  if (!config.article_enabled) {
    return <ModuleDisabled moduleLabel="文章" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
            文章
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
            关于音乐、关于生活、也关于你我。
          </p>

          {/* Keyword Search（纯 HTML GET 表单，静态托管可用） */}
          <form
            action="/articles"
            method="GET"
            className="mx-auto mt-8 flex max-w-md items-center"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <label htmlFor="article-search" className="sr-only">
                搜索文章
              </label>
              <input
                id="article-search"
                type="search"
                name="keyword"
                placeholder="搜索文章标题..."
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-accent-strong px-5 text-sm font-medium text-on-accent transition-colors duration-200 ease-out hover:bg-accent-hover"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      {/* Category Filter + Article List + Sidebar（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <section className="flex-1 py-12 md:py-16">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-8">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-11 animate-pulse rounded-full bg-surface" />
                <div className="h-72 animate-pulse rounded-xl bg-surface" />
                <div className="h-72 animate-pulse rounded-xl bg-surface" />
              </div>
              <div className="h-80 animate-pulse rounded-xl bg-surface" />
            </div>
          </section>
        }
      >
        <ArticlesListContent />
      </Suspense>
    </div>
  );
}
