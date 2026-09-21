"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { travels, getModuleConfig, TravelGuide, PaginatedResponse } from "@/lib/api";
import { TravelCard } from "@/components/travel-card";
import { Pagination } from "@/components/pagination";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "", label: "最新发布" },
  { value: "views", label: "最多浏览" },
  { value: "likes", label: "最多点赞" },
  { value: "rating", label: "最高评分" },
];

function TravelsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const sort = searchParams.get("sort") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [result, setResult] = useState<PaginatedResponse<TravelGuide> | null>(null);
  const [travelEnabled, setTravelEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const buildUrl = useCallback(
    (params: { keyword?: string; sort?: string; page?: number }) => {
      const sp = new URLSearchParams();
      if (params.keyword) sp.set("keyword", params.keyword);
      if (params.sort) sp.set("sort", params.sort);
      if (params.page && params.page > 1) sp.set("page", String(params.page));
      const query = sp.toString();
      return `/travels${query ? `?${query}` : ""}`;
    },
    []
  );

  const fetchTravels = useCallback(async () => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        travels.list({
          page,
          page_size: PAGE_SIZE,
          keyword: keyword || undefined,
          sort: sort || undefined,
        }),
        getModuleConfig(),
      ]);
      setResult(res);
      setTravelEnabled(modules.travel_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载旅行攻略失败");
    } finally {
      setLoading(false);
    }
  }, [page, keyword, sort]);

  useEffect(() => {
    fetchTravels();
  }, [fetchTravels]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), sort, page: 1 }));
  };

  const handleSortChange = (value: string) => {
    router.push(buildUrl({ keyword, sort: value, page: 1 }));
  };

  if (!loading && !travelEnabled) {
    return <ModuleDisabled moduleLabel="旅行攻略" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            旅行攻略
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">共 {result?.total ?? 0} 篇攻略</p>
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
              placeholder="搜索目的地、标题..."
              className="pl-9"
              aria-label="搜索旅行攻略"
            />
          </form>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            aria-label="排序方式"
            className="h-8 cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {SORT_OPTIONS.map((opt) => (
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
        <Loading text="加载旅行攻略中..." />
      ) : error ? (
        <ErrorState title="旅行攻略加载失败" message={error} onRetry={fetchTravels} />
      ) : !result || result.list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的攻略
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.list.map((travel) => (
              <TravelCard key={travel.id} travel={travel} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={page}
              totalPages={result.total_pages}
              baseUrl={buildUrl({ keyword, sort })}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function TravelsPage() {
  return (
    <Suspense fallback={<Loading text="加载中..." />}>
      <TravelsPageContent />
    </Suspense>
  );
}
