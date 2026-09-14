import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { VideosListContent } from "@/components/VideosListContent";

export default async function VideosPage() {
  const config = await getModuleConfig();
  if (!config.video_enabled) {
    return <ModuleDisabled moduleLabel="视频" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-playfair)] text-4xl font-bold text-text-primary md:text-5xl">
            视频
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            用镜头记录动态的世界 —— 航拍、延时与旅拍 Vlog。
          </p>

          {/* Keyword Search（纯 HTML GET 表单，静态托管可用） */}
          <form
            action="/videos"
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
                placeholder="搜索视频标题..."
                aria-label="搜索视频"
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

      {/* Video List（客户端按 searchParams 取数渲染） */}
      <Suspense
        fallback={
          <section className="flex-1 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="h-72 animate-pulse rounded-radius-md bg-surface md:h-96" />
            </div>
          </section>
        }
      >
        <VideosListContent />
      </Suspense>
    </div>
  );
}
