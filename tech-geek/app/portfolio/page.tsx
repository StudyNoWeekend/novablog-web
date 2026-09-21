"use client";

import { useEffect, useState } from "react";
import { portfolios, getModuleConfig, Portfolio } from "@/lib/api";
import { PortfolioCard } from "@/components/portfolio-card";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioPage() {
  const [list, setList] = useState<Portfolio[]>([]);
  const [portfolioEnabled, setPortfolioEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        portfolios.list({ page: 1, page_size: 60 }),
        getModuleConfig(),
      ]);
      setList(res.list);
      setPortfolioEnabled(modules.portfolio_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载作品集失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  if (!loading && !portfolioEnabled) {
    return <ModuleDisabled moduleLabel="作品集" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">作品集</h1>
        <p className="mt-1 text-sm text-muted-foreground">共 {list.length} 个作品集</p>
      </header>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="作品集加载失败" message={error} onRetry={fetchPortfolios} />
      ) : list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          暂无作品集
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      )}
    </div>
  );
}
