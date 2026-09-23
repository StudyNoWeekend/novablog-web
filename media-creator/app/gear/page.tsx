import { Suspense } from "react";
import { EquipmentContent } from "./gear-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { moduleConfig, ALL_ENABLED } from "@/lib/api";

export const metadata = { title: "设备" };

export default async function GearPage() {
  const modules = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!modules.equipment_enabled) {
    return <ModuleDisabled moduleLabel="设备" />;
  }
  return (
    <Suspense fallback={<GearSkeleton />}>
      <EquipmentContent />
    </Suspense>
  );
}

function GearSkeleton() {
  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-muted" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4">
              <div className="aspect-square animate-pulse rounded-xl bg-muted" />
              <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
