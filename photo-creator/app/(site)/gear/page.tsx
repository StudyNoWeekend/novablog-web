import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api";
import { ModuleDisabled } from "@/components/module-disabled";
import { GearListContent } from "@/components/gear-list-page";
import { ArticleGridSkeleton } from "@/components/loading";

export const metadata: Metadata = {
  title: "装备",
  description: "拍摄装备与出行家当，件件趁手。",
};

export default async function Page() {
  const config = await getModuleConfig();
  if (!config.equipment_enabled) {
    return <ModuleDisabled moduleLabel="装备" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 页头 + 纯 HTML GET 搜索表单（静态托管可用） */}
      <div className="mb-10 py-16 md:mb-14 md:py-24 lg:py-32">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          装备
        </p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          我的装备
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          拍摄装备与出行家当，件件趁手。
        </p>

        <form action="/gear" method="GET" className="relative mt-8 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            name="keyword"
            defaultValue=""
            placeholder="搜索装备名称、品牌"
            aria-label="搜索装备"
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </form>
      </div>

      <Suspense fallback={<ArticleGridSkeleton count={6} />}>
        <GearListContent />
      </Suspense>
    </div>
  );
}
