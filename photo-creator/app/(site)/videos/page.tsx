import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api";
import { ModuleDisabled } from "@/components/module-disabled";
import { VideosListContent } from "@/components/videos-list-page";

export const metadata: Metadata = {
  title: "视频",
  description: "用镜头记录光影与故事。",
};

export default async function Page() {
  const config = await getModuleConfig();
  if (!config.video_enabled) {
    return <ModuleDisabled moduleLabel="视频" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 页头 + 纯 HTML GET 搜索表单（静态托管可用） */}
      <div className="mb-10 py-16 md:mb-14 md:py-24 lg:py-32">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          视频
        </p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          视频作品
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          用镜头记录光影与故事。
        </p>

        <form action="/videos" method="GET" className="relative mt-8 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            name="keyword"
            defaultValue=""
            placeholder="搜索视频标题"
            aria-label="搜索视频"
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </form>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8 lg:pb-32">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          </div>
        }
      >
        <VideosListContent />
      </Suspense>
    </div>
  );
}
