"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PortfolioCard } from "@/components/PortfolioCard";
import { ErrorState } from "@/components/ErrorState";
import { getPortfolios } from "@/lib/api/portfolios";
import type { Portfolio } from "@/lib/types";

interface ListResult {
  key: string;
  portfolios: Portfolio[];
  totalPages: number;
  failed: boolean;
}

/** 作品集列表（客户端按 searchParams 取数）：卡片网格 + 分页 + 失败重试 */
export function PortfoliosListContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const currentPage = Number(page) || 1;
  const [retryCount, setRetryCount] = useState(0);

  // 以查询参数组合为 key：结果不匹配当前 key 时自动呈现加载态（避免在 effect 内同步 setState）
  const resultKey = useMemo(
    () => `${currentPage}|${retryCount}`,
    [currentPage, retryCount]
  );

  const [result, setResult] = useState<ListResult | null>(null);
  const loading = result === null || result.key !== resultKey;

  useEffect(() => {
    let cancelled = false;
    getPortfolios({ page: currentPage, page_size: 12 }).then((data) => {
      if (cancelled) return;
      setResult({
        key: resultKey,
        portfolios: data.list,
        totalPages: data.total_pages,
        failed: Boolean(data.failed),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [resultKey, currentPage]);

  const portfolios = result?.key === resultKey ? result.portfolios : [];
  const totalPages = result?.key === resultKey ? result.totalPages : 0;
  const failed = result?.key === resultKey ? result.failed : false;

  const buildHref = (nextPage: number) => {
    const query = new URLSearchParams();
    if (nextPage > 1) query.set("page", String(nextPage));
    const qs = query.toString();
    return qs ? `/portfolio?${qs}` : "/portfolio";
  };

  if (failed) {
    return <ErrorState onRetry={() => setRetryCount((prev) => prev + 1)} />;
  }

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-xl bg-surface"
              />
            ))}
          </div>
        ) : portfolios.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildHref(currentPage - 1)}
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
                    href={buildHref(currentPage + 1)}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
                  >
                    下一页
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-hand text-3xl text-text-subtle">smile…</p>
            <p className="mt-2 text-lg text-text-muted">作品集整理中，敬请期待</p>
            <Link
              href="/portfolio"
              className="mt-4 cursor-pointer text-sm font-medium text-accent-hover transition-colors duration-200 ease-out hover:text-accent"
            >
              查看全部作品集
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
