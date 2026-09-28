"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { openSources, getModuleConfig, type OpenSource } from "@/lib/api";
import { OpenSourceCard } from "./open-source-card";
import { Pagination } from "./pagination";
import { ErrorState } from "./error-state";
import { ModuleDisabled } from "./module-disabled";
import { ArticleGridSkeleton } from "./loading";

const PAGE_SIZE = 12;

function OpenSourceListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const keyword = searchParams.get("keyword") || "";

  const [items, setItems] = useState<OpenSource[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const load = useCallback(
    async (currentPage: number, kw?: string) => {
      setLoading(true);
      setError(null);
      try {
        const [res, modules] = await Promise.all([
          openSources.list({ page: currentPage, page_size: PAGE_SIZE, keyword: kw || undefined }),
          getModuleConfig(),
        ]);
        setItems(res.list);
        setTotalPages(res.total_pages);
        setModuleEnabled(modules.open_source_enabled);
        if (currentPage > res.total_pages && res.total_pages > 0) {
          setPage(res.total_pages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载开源作品失败");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(page, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) params.set("keyword", searchValue.trim());
    else params.delete("keyword");
    router.push(`${pathname}?${params.toString()}`);
    // 筛选变化回到第 1 页（与 searchParams 更新合并为一次渲染，effect 只触发一次请求）
    if (page !== 1) setPage(1);
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="开源作品" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
      <div className="mb-10 md:mb-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">开源</p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          开源作品
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          把重复的问题交给代码，这里收录我的开源实践。
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        <form onSubmit={handleSearchSubmit} className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索项目名称、简介"
            aria-label="搜索开源作品"
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </form>
      </div>

      {loading ? (
        <ArticleGridSkeleton count={9} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(page, keyword)} />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的开源作品
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((project) => (
              <OpenSourceCard key={project.id} project={project} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export function OpenSourceListPage() {
  return (
    <Suspense fallback={<ArticleGridSkeleton count={9} />}>
      <OpenSourceListContent />
    </Suspense>
  );
}
