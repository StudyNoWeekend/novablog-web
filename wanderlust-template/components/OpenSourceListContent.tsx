"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OpenSourceCard } from "@/components/OpenSourceCard";
import { ErrorState, ListEmptyState } from "@/components/ErrorState";
import { getOpenSources } from "@/lib/api/open-sources";
import type { OpenSource } from "@/lib/types";

interface ListResult {
  key: string;
  items: OpenSource[];
  totalPages: number;
  failed: boolean;
}

export function OpenSourceListContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // 错误重试：递增该值重新触发取数
  const [refreshKey, setRefreshKey] = useState(0);

  // 以查询参数组合为 key：结果不匹配当前 key 时自动呈现加载态（避免在 effect 内同步 setState）
  const resultKey = useMemo(
    () => `${keyword}|${currentPage}|${refreshKey}`,
    [keyword, currentPage, refreshKey]
  );

  const [result, setResult] = useState<ListResult | null>(null);
  const loading = result === null || result.key !== resultKey;

  useEffect(() => {
    let cancelled = false;
    getOpenSources({ keyword: keyword || undefined, page: currentPage, page_size: 12 }).then(
      (res) => {
        if (cancelled) return;
        setResult({
          key: resultKey,
          items: res.list,
          totalPages: res.total_pages,
          failed: Boolean(res.failed),
        });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [resultKey, keyword, currentPage, refreshKey]);

  const items = result?.key === resultKey ? result.items : [];
  const totalPages = result?.key === resultKey ? result.totalPages : 0;
  const failed = result?.key === resultKey ? result.failed : false;

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          /* Skeleton 骨架屏 */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-radius-lg bg-surface"
              />
            ))}
          </div>
        ) : failed ? (
          /* 错误重试态 */
          <ErrorState
            title="开源作品加载失败"
            onRetry={() => setRefreshKey((k) => k + 1)}
          />
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <OpenSourceCard key={item.id} item={item} />
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildHref({ keyword, page: String(currentPage - 1) })}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    上一页
                  </Link>
                )}
                <span className="px-4 text-sm text-text-muted">
                  {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={buildHref({ keyword, page: String(currentPage + 1) })}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    下一页
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          /* 虚线空状态 */
          <ListEmptyState
            message={keyword ? `未找到与「${keyword}」相关的开源作品` : "暂无开源作品，敬请期待"}
          />
        )}
      </div>
    </section>
  );
}

/** 组装列表页查询参数（空值不写入） */
function buildHref(params: Record<string, string>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/open-source?${qs}` : "/open-source";
}
