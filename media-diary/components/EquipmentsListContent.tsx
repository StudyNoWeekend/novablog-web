"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Backpack } from "lucide-react";
import { ErrorState, ListEmptyState } from "@/components/ErrorState";
import { getEquipments } from "@/lib/api/equipments";
import type { Equipment } from "@/lib/types";

interface ListResult {
  key: string;
  equipments: Equipment[];
  totalPages: number;
  failed: boolean;
}

/** 装备列表（客户端按 searchParams 取数）：纯展示卡片网格 + 分页 + 失败重试 */
export function EquipmentsListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const page = searchParams.get("page") ?? "1";
  const currentPage = Number(page) || 1;
  const [retryCount, setRetryCount] = useState(0);

  // 以查询参数组合为 key：结果不匹配当前 key 时自动呈现加载态（避免在 effect 内同步 setState）
  const resultKey = useMemo(
    () => `${keyword}|${currentPage}|${retryCount}`,
    [keyword, currentPage, retryCount]
  );

  const [result, setResult] = useState<ListResult | null>(null);
  const loading = result === null || result.key !== resultKey;

  useEffect(() => {
    let cancelled = false;
    getEquipments({
      keyword: keyword || undefined,
      page: currentPage,
      page_size: 12,
    }).then((data) => {
      if (cancelled) return;
      setResult({
        key: resultKey,
        equipments: data.list,
        totalPages: data.total_pages,
        failed: Boolean(data.failed),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [resultKey, keyword, currentPage]);

  const equipments = result?.key === resultKey ? result.equipments : [];
  const totalPages = result?.key === resultKey ? result.totalPages : 0;
  const failed = result?.key === resultKey ? result.failed : false;

  const buildHref = (params: Record<string, string | undefined>): string => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    const qs = query.toString();
    return qs ? `/gear?${qs}` : "/gear";
  };

  if (failed) {
    return (
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ErrorState onRetry={() => setRetryCount((prev) => prev + 1)} />
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-xl bg-surface"
              />
            ))}
          </div>
        ) : equipments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {equipments.map((equipment) => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildHref({ keyword, page: String(currentPage - 1) })}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                  >
                    上一页
                  </Link>
                )}
                <span className="px-4 font-hand text-lg text-text-muted">
                  {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={buildHref({ keyword, page: String(currentPage + 1) })}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                  >
                    下一页
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <ListEmptyState
            message={
              keyword
                ? `未找到与「${keyword}」相关的装备`
                : "装备清单整理中，敬请期待"
            }
          />
        )}
      </div>
    </section>
  );
}

/** 装备卡片：纯展示（图片/名称/品牌/描述），不链接详情页 */
function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-background-soft">
        {equipment.image_url ? (
          <Image
            src={equipment.image_url}
            alt={equipment.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-subtle">
            <Backpack className="h-10 w-10" strokeWidth={1.2} />
          </div>
        )}
        {equipment.brand && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            {equipment.brand}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-display text-base leading-snug text-text-primary">
          {equipment.name}
        </h2>
        {equipment.description && (
          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-text-muted">
            {equipment.description}
          </p>
        )}
      </div>
    </article>
  );
}
