"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Images } from "lucide-react";
import { portfolios, type PaginatedResponse, type Portfolio } from "@/lib/api";
import { PortfolioCard } from "@/components/portfolio-card";
import { Pagination } from "@/components/pagination";
import { ErrorState } from "@/components/error-state";

const PAGE_SIZE = 12;

export function PortfoliosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [res, setRes] = useState<PaginatedResponse<Portfolio> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    portfolios
      .list({ page, page_size: PAGE_SIZE, keyword: keyword || undefined })
      .then((data) => {
        if (!cancelled) {
          setRes(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "加载失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [keyword, page, reloadKey]);

  const handlePageChange = (p: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (p > 1) sp.set("page", String(p));
    else sp.delete("page");
    const query = sp.toString();
    router.push(`/portfolio${query ? `?${query}` : ""}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {keyword && !loading && (
        <div className="text-sm text-muted-foreground">
          {res && res.total > 0
            ? `找到 ${res.total} 个与 "${keyword}" 相关的作品集`
            : `未找到与 "${keyword}" 相关的作品集`}
        </div>
      )}

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <div className="p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-8">
          <ErrorState
            title="作品集加载失败"
            message={error}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        </div>
      ) : !res || res.list.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Images className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4">作品集整理中，敬请期待</p>
          <Link
            href="/portfolio"
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            查看全部作品集
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {res.list.map((portfolio, i) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} priority={i < 3} />
            ))}
          </div>
          {res.total_pages > 1 && (
            <div className="mt-10">
              <Pagination
                page={page}
                totalPages={res.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
