"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Camera } from "lucide-react";
import { getPortfolios } from "@/lib/api/portfolios";
import type { Portfolio } from "@/lib/types";
import { PortfolioCard } from "@/components/PortfolioCard";
import { ErrorState } from "@/components/ErrorState";

export function PortfoliosListContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const currentPage = Number(page) || 1;
  const [retryCount, setRetryCount] = useState(0);

  const resultKey = useMemo(
    () => `${currentPage}|${retryCount}`,
    [currentPage, retryCount]
  );

  const [result, setResult] = useState<{
    key: string;
    portfolios: Portfolio[];
    totalPages: number;
    failed: boolean;
  } | null>(null);
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
                className="aspect-[4/3] animate-pulse rounded-radius-lg bg-surface"
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
                    href={buildHref(currentPage + 1)}
                    className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    下一页
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle">
              <Camera className="h-7 w-7 text-accent" strokeWidth={1.5} />
            </div>
            <p className="mt-6 font-display text-xl text-text-secondary">
              作品集整理中，敬请期待
            </p>
            <Link
              href="/portfolio"
              className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              查看全部作品集
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
