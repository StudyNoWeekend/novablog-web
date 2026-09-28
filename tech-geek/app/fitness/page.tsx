"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { fitness, getModuleConfig, FitnessRecord, PaginatedResponse } from "@/lib/api";
import { FitnessCard } from "@/components/fitness-card";
import { Pagination } from "@/components/pagination";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 15;

/** 训练类型筛选选项（后端 type：strength|cardio|stretch，all 或空=全部） */
const TYPE_OPTIONS = [
  { value: "", label: "全部类型" },
  { value: "strength", label: "力量" },
  { value: "cardio", label: "有氧" },
  { value: "stretch", label: "拉伸" },
];

function FitnessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [result, setResult] = useState<PaginatedResponse<FitnessRecord> | null>(null);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const buildUrl = useCallback(
    (params: { keyword?: string; type?: string; page?: number }) => {
      const sp = new URLSearchParams();
      if (params.keyword) sp.set("keyword", params.keyword);
      if (params.type) sp.set("type", params.type);
      if (params.page && params.page > 1) sp.set("page", String(params.page));
      const query = sp.toString();
      return `/fitness${query ? `?${query}` : ""}`;
    },
    []
  );

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        fitness.list({
          page,
          page_size: PAGE_SIZE,
          keyword: keyword || undefined,
          type: type || "all",
        }),
        getModuleConfig(),
      ]);
      setResult(res);
      setModuleEnabled(modules.fitness_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载训练记录失败");
    } finally {
      setLoading(false);
    }
  }, [page, keyword, type]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), type, page: 1 }));
  };

  const handleTypeChange = (value: string) => {
    router.push(buildUrl({ keyword, type: value, page: 1 }));
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="健身训练" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            健身训练
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            共 {result?.total ?? 0} 条训练记录
          </p>
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
              placeholder="搜索训练标题..."
              className="pl-9"
              aria-label="搜索训练记录"
            />
          </form>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            aria-label="训练类型筛选"
            className="h-8 cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {TYPE_OPTIONS.map((opt) => (
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
        <Loading text="加载训练记录中..." />
      ) : error ? (
        <ErrorState title="训练记录加载失败" message={error} onRetry={fetchRecords} />
      ) : !result || result.list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的训练记录
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-4xl space-y-4">
            {result.list.map((record) => (
              <FitnessCard key={record.id} record={record} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={page}
              totalPages={result.total_pages}
              baseUrl={buildUrl({ keyword, type })}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function FitnessPage() {
  return (
    <Suspense fallback={<CardGridSkeleton variant="row" count={6} />}>
      <FitnessPageContent />
    </Suspense>
  );
}
