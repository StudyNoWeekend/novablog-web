"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { equipments, getModuleConfig, Equipment } from "@/lib/api";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { Skeleton } from "@/components/ui/skeleton";

export default function GearPage() {
  const [list, setList] = useState<Equipment[]>([]);
  const [equipmentEnabled, setEquipmentEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        equipments.list({ page: 1, page_size: 100 }),
        getModuleConfig(),
      ]);
      setList(res.list);
      setEquipmentEnabled(modules.equipment_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载器材失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  if (!loading && !equipmentEnabled) {
    return <ModuleDisabled moduleLabel="器材" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">摄影器材</h1>
        <p className="mt-1 text-sm text-muted-foreground">共 {list.length} 件器材</p>
      </header>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="器材加载失败" message={error} onRetry={fetchEquipments} />
      ) : list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          暂无器材
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((equipment) => (
            <article
              key={equipment.id}
              className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {equipment.image_url ? (
                  <Image
                    src={equipment.image_url}
                    alt={equipment.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <Camera className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-foreground">{equipment.name}</h2>
                  {equipment.brand && (
                    /* 本仓库 Badge 非 asChild 用法会丢弃 children，品牌徽章用普通 span 实现 */
                    <span className="inline-flex h-5 shrink-0 items-center rounded-4xl border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      {equipment.brand}
                    </span>
                  )}
                </div>
                {equipment.description && (
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {equipment.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
