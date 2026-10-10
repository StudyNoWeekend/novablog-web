"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Backpack } from "lucide-react";
import { equipments, type Equipment } from "@/lib/api";
import { EquipmentCard } from "./equipment-card";
import { ErrorState } from "./error-state";
import { ArticleGridSkeleton } from "./loading";

const PAGE_SIZE = 12;

interface ListResult {
  key: string;
  equipments: Equipment[];
  totalPages: number;
  failed: boolean;
}

/** 按 URL 查询参数组合生成 /gear 链接（空值剔除） */
function buildHref(params: Record<string, string>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/gear?${qs}` : "/gear";
}

export function GearListContent() {
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
    equipments
      .list({
        keyword: keyword || undefined,
        page: currentPage,
        page_size: PAGE_SIZE,
      })
      .then((data) => {
        if (cancelled) return;
        setResult({
          key: resultKey,
          equipments: data.list,
          totalPages: data.total_pages,
          failed: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ key: resultKey, equipments: [], totalPages: 0, failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [resultKey, keyword, currentPage]);

  const items = result?.key === resultKey ? result.equipments : [];
  const totalPages = result?.key === resultKey ? result.totalPages : 0;
  const failed = result?.key === resultKey && result.failed;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8 lg:pb-32">
      {loading ? (
        <ArticleGridSkeleton count={6} />
      ) : failed ? (
        <ErrorState message="装备加载失败" onRetry={() => setRetryCount((prev) => prev + 1)} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
          <Backpack className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">
            {keyword
              ? `没有找到与「${keyword}」相关的装备`
              : "装备清单整理中，敬请期待"}
          </p>
          {keyword && (
            <Link
              href="/gear"
              className="cursor-pointer rounded-full border border-border px-5 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              查看全部装备
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>

          {/* 分页（链接驱动，静态托管可用） */}
          {totalPages > 1 && (
            <nav
              aria-label="分页"
              className="mt-12 flex items-center justify-center gap-2"
            >
              {currentPage > 1 ? (
                <Link
                  href={buildHref({ keyword, page: String(currentPage - 1) })}
                  className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-card px-4 text-sm text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  上一页
                </Link>
              ) : null}
              <span className="px-4 text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={buildHref({ keyword, page: String(currentPage + 1) })}
                  className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-card px-4 text-sm text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  下一页
                </Link>
              ) : null}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
