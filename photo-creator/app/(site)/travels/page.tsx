import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api";
import { ModuleDisabled } from "@/components/module-disabled";
import { TravelsListContent } from "@/components/travels-list-page";
import { ArticleGridSkeleton } from "@/components/loading";

export const metadata: Metadata = {
  title: "旅行攻略",
  description: "行程、景点与避坑经验，一次整理给你。",
};

export default async function Page() {
  const config = await getModuleConfig();
  if (!config.travel_enabled) {
    return <ModuleDisabled moduleLabel="旅行攻略" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 页头 + 纯 HTML GET 搜索表单（静态托管可用） */}
      <div className="mb-10 py-16 md:mb-14 md:py-24 lg:py-32">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          攻略
        </p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          旅行攻略
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          行程、景点与避坑经验，一次整理给你。
        </p>

        <form action="/travels" method="GET" className="relative mt-8 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            name="keyword"
            defaultValue=""
            placeholder="搜索目的地、攻略标题"
            aria-label="搜索旅行攻略"
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </form>
      </div>

      <Suspense fallback={<ArticleGridSkeleton count={6} />}>
        <TravelsListContent />
      </Suspense>
    </div>
  );
}
