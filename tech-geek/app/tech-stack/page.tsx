"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { techStacks, getModuleConfig, TechStack, PaginatedResponse } from "@/lib/api";
import { TechStackCard } from "@/components/tech-stack-card";
import { Pagination } from "@/components/pagination";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

/** 熟练度筛选选项（后端 level：1=了解 2=熟悉 3=熟练 4=精通） */
const LEVEL_OPTIONS = [
  { value: "", label: "全部熟练度" },
  { value: "1", label: "了解" },
  { value: "2", label: "熟悉" },
  { value: "3", label: "熟练" },
  { value: "4", label: "精通" },
];

function TechStackPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const level = searchParams.get("level") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [result, setResult] = useState<PaginatedResponse<TechStack> | null>(null);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const buildUrl = useCallback(
    (params: { keyword?: string; level?: string; page?: number }) => {
      const sp = new URLSearchParams();
      if (params.keyword) sp.set("keyword", params.keyword);
      if (params.level) sp.set("level", params.level);
      if (params.page && params.page > 1) sp.set("page", String(params.page));
      const query = sp.toString();
      return `/tech-stack${query ? `?${query}` : ""}`;
    },
    []
  );

  const fetchStacks = useCallback(async () => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        techStacks.list({
          page,
          page_size: PAGE_SIZE,
          keyword: keyword || undefined,
          level: level ? Number(level) : undefined,
        }),
        getModuleConfig(),
      ]);
      setResult(res);
      setModuleEnabled(modules.tech_stack_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载技术栈失败");
    } finally {
      setLoading(false);
    }
  }, [page, keyword, level]);

  useEffect(() => {
    fetchStacks();
  }, [fetchStacks]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), level, page: 1 }));
  };

  const handleLevelChange = (value: string) => {
    router.push(buildUrl({ keyword, level: value, page: 1 }));
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="技术栈" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            技术栈
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">共 {result?.total ?? 0} 项技术</p>
        </div>

        <div className="flex w-full gap-2 md:max-w-xl">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索技术名称、分类..."
              className="pl-9"
              aria-label="搜索技术栈"
            />
          </form>
          <select
            value={level}
            onChange={(e) => handleLevelChange(e.target.value)}
            aria-label="熟练度筛选"
            className="h-8 cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button type="button" onClick={handleSearch} className="cursor-pointer">
            搜索
          </Button>
        </div>
      </div>

      {loading ? (
        <Loading text="加载技术栈中..." />
      ) : error ? (
        <ErrorState title="技术栈加载失败" message={error} onRetry={fetchStacks} />
      ) : !result || result.list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的技术
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.list.map((stack) => (
              <TechStackCard key={stack.id} stack={stack} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={page}
              totalPages={result.total_pages}
              baseUrl={buildUrl({ keyword, level })}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function TechStackPage() {
  return (
    <Suspense fallback={<CardGridSkeleton />}>
      <TechStackPageContent />
    </Suspense>
  );
}
