"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Backpack } from "lucide-react";
import { EquipmentCard } from "@/components/EquipmentCard";
import { ErrorState } from "@/components/ErrorState";
import { getEquipments } from "@/lib/api/equipments";
import type { Equipment } from "@/lib/types";

export function EquipmentsListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [loading, setLoading] = useState(true);
  // 错误重试：递增该值重新触发取数
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState({
    list: [] as Equipment[],
    total_pages: 0,
    failed: false,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEquipments({
      keyword: keyword || undefined,
      page: currentPage,
      page_size: 12,
    }).then((res) => {
      if (cancelled) return;
      setData({
        list: res.list,
        total_pages: res.total_pages,
        failed: Boolean(res.failed),
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [keyword, currentPage, refreshKey]);

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          /* Skeleton 骨架屏 */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-radius-md bg-surface"
              >
                <div className="aspect-[4/3] bg-text-muted/10" />
                <div className="space-y-2 p-5">
                  <div className="h-4 w-32 rounded bg-text-muted/20" />
                  <div className="h-3 w-24 rounded bg-text-muted/10" />
                </div>
              </div>
            ))}
          </div>
        ) : data.failed ? (
          /* 错误重试态 */
          <ErrorState
            title="装备加载失败"
            onRetry={() => setRefreshKey((k) => k + 1)}
          />
        ) : data.list.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.list.map((equipment) => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
            </div>

            {/* 分页 */}
            {data.total_pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildHref(keyword, currentPage - 1)}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    上一页
                  </Link>
                )}
                <span className="px-4 text-sm text-text-muted">
                  {currentPage} / {data.total_pages}
                </span>
                {currentPage < data.total_pages && (
                  <Link
                    href={buildHref(keyword, currentPage + 1)}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    下一页
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle">
              <Backpack className="h-7 w-7 text-accent" strokeWidth={1.5} />
            </div>
            <p className="mt-6 font-heading text-xl text-text-secondary">
              {keyword
                ? `未找到与「${keyword}」相关的装备`
                : "装备清单整理中，敬请期待"}
            </p>
            <Link
              href="/gear"
              className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
            >
              查看全部装备
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/** 组装列表页查询参数（空值不写入） */
function buildHref(keyword: string, page: number): string {
  const query = new URLSearchParams();
  if (keyword) query.set("keyword", keyword);
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  return qs ? `/gear?${qs}` : "/gear";
}
