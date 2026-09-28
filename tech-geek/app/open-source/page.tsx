"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { openSources, getModuleConfig, OpenSource, PaginatedResponse } from "@/lib/api";
import { OpenSourceCard } from "@/components/open-source-card";
import { Pagination } from "@/components/pagination";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

function OpenSourcePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [result, setResult] = useState<PaginatedResponse<OpenSource> | null>(null);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const buildUrl = useCallback(
    (params: { keyword?: string; page?: number }) => {
      const sp = new URLSearchParams();
      if (params.keyword) sp.set("keyword", params.keyword);
      if (params.page && params.page > 1) sp.set("page", String(params.page));
      const query = sp.toString();
      return `/open-source${query ? `?${query}` : ""}`;
    },
    []
  );

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        openSources.list({
          page,
          page_size: PAGE_SIZE,
          keyword: keyword || undefined,
        }),
        getModuleConfig(),
      ]);
      setResult(res);
      setModuleEnabled(modules.open_source_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载开源作品失败");
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), page: 1 }));
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="开源作品" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            开源作品
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">共 {result?.total ?? 0} 个项目</p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full gap-2 md:max-w-md">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索项目名称、简介..."
              className="pl-9"
              aria-label="搜索开源作品"
            />
          </div>
          <Button type="submit" className="cursor-pointer">
            搜索
          </Button>
        </form>
      </div>

      {loading ? (
        <Loading text="加载开源作品中..." />
      ) : error ? (
        <ErrorState title="开源作品加载失败" message={error} onRetry={fetchProjects} />
      ) : !result || result.list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的开源作品
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.list.map((project) => (
              <OpenSourceCard key={project.id} project={project} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination page={page} totalPages={result.total_pages} baseUrl={buildUrl({ keyword })} />
          </div>
        </>
      )}
    </div>
  );
}

export default function OpenSourcePage() {
  return (
    <Suspense fallback={<CardGridSkeleton />}>
      <OpenSourcePageContent />
    </Suspense>
  );
}
