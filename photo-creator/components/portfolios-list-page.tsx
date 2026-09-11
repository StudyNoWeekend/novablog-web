"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { portfolios, categories, Portfolio, Category } from "@/lib/api";
import { PortfolioCard } from "./portfolio-card";
import { CategoryFilter } from "./category-filter";
import { Pagination } from "./pagination";
import { ErrorState, EmptyState } from "./error-state";
import { PortfolioGridSkeleton } from "./loading";

export function PortfoliosListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = searchParams.get("category_id") || undefined;

  const [items, setItems] = useState<Portfolio[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (currentPage: number, cat?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([
        portfolios.list({ page: currentPage, page_size: pageSize, category_id: cat }),
        categories.list().catch(() => [] as Category[]),
      ]);
      setItems(p.list);
      setTotalPages(p.total_pages);
      setCategoriesList(c);
      if (currentPage > p.total_pages && p.total_pages > 0) {
        setPage(p.total_pages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载作品集失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    load(1, categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  useEffect(() => {
    load(page, categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleCategoryChange = (id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("category_id", id);
    } else {
      params.delete("category_id");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
      <div className="mb-10 md:mb-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">01 精选作品</p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          作品集
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">按主题分类浏览摄影作品，发现光影背后的故事。</p>
      </div>

      <div className="mb-8">
        <CategoryFilter categories={categoriesList} selectedId={categoryId} onSelect={handleCategoryChange} />
      </div>

      {loading ? (
        <PortfolioGridSkeleton count={9} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(page, categoryId)} />
      ) : items.length === 0 ? (
        <EmptyState title="暂无作品集" description="该分类下还没有作品集" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
