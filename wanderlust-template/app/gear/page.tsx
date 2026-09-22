import { Suspense } from "react";
import { Search } from "lucide-react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { EquipmentContent } from "@/components/EquipmentContent";

export const metadata = { title: "装备" };

export default async function GearPage() {
  const config = await getModuleConfig();
  if (!config.equipment_enabled) {
    return <ModuleDisabled moduleLabel="装备" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl text-text-primary md:text-5xl">
            旅行装备
            <span className="ml-3 align-middle font-hand text-2xl font-medium text-accent/70">
              Gear
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            轻装上阵，也要拍得好看——我在路上的装备清单
          </p>

          {/* Keyword Search（纯 HTML GET 表单，静态托管可用） */}
          <form
            action="/gear"
            method="GET"
            className="mx-auto mt-8 flex max-w-md items-center"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="keyword"
                placeholder="搜索装备名称..."
                aria-label="搜索装备"
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="flex-1 py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-radius-lg bg-surface"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <EquipmentContent />
      </Suspense>
    </div>
  );
}
