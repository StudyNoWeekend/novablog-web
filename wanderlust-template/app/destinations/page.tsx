import { Suspense } from "react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { DestinationsContent } from "@/components/DestinationsContent";

export const metadata = { title: "目的地" };

export default async function DestinationsPage() {
  const config = await getModuleConfig();
  if (!config.travel_enabled) {
    return <ModuleDisabled moduleLabel="旅行攻略" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl text-text-primary md:text-5xl">
            目的地
            <span className="ml-3 align-middle font-hand text-2xl font-medium text-accent/70">
              Destinations
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            世界很大，从这些地方开始，一站一站走
          </p>
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
                    className="aspect-[16/10] animate-pulse rounded-radius-lg bg-surface"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <DestinationsContent />
      </Suspense>
    </div>
  );
}
