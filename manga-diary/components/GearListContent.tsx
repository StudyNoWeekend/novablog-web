"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Backpack } from "lucide-react";
import { ErrorState, ListEmptyState } from "@/components/ErrorState";
import { getEquipments } from "@/lib/api/equipments";
import { getFileUrl } from "@/lib/api/client";
import type { Equipment } from "@/lib/types";

export function GearListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const [loading, setLoading] = useState(true);
  // 错误重试：递增该值重新触发取数
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState<{
    list: Equipment[];
    failed: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEquipments({
      keyword: keyword || undefined,
      page: 1,
      page_size: 60,
    }).then((res) => {
      if (cancelled) return;
      setData({
        list: res.list,
        failed: Boolean(res.failed),
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, refreshKey]);

  if (loading || data === null) {
    /* Skeleton 骨架屏 */
    return (
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-radius-md border border-border bg-background-soft"
              >
                <div className="aspect-[4/3] bg-border-strong/40" />
                <div className="space-y-2 p-5">
                  <div className="h-4 w-28 rounded bg-text-muted/20" />
                  <div className="h-3 w-24 rounded bg-text-muted/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (data.failed) {
    /* 错误重试态 */
    return (
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ErrorState
            title="装备加载失败"
            onRetry={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </section>
    );
  }

  if (data.list.length === 0) {
    /* 虚线空状态 */
    return (
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ListEmptyState
            message={keyword ? `未找到与「${keyword}」相关的装备` : "装备清单整理中，敬请期待"}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 纯展示卡片：图片 + 品牌徽标 + 名称 + 描述（无详情页） */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.list.map((equipment) => (
            <article
              key={equipment.id}
              className="flex flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-background-soft">
                {equipment.image_url ? (
                  <Image
                    src={getFileUrl(equipment.image_url)}
                    alt={equipment.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="halftone flex h-full items-center justify-center">
                    <Backpack className="h-10 w-10 text-text-subtle" strokeWidth={1} />
                  </div>
                )}
                {equipment.brand && (
                  <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-accent backdrop-blur-sm">
                    {equipment.brand}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg leading-snug text-text-primary">
                  {equipment.name}
                </h3>
                {equipment.description && (
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-text-muted">
                    {equipment.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
