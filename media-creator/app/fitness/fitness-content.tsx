"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Dumbbell, Loader2, Search } from "lucide-react";
import { fitness, moduleConfig, ALL_ENABLED, type PaginatedResponse, type FitnessRecord } from "@/lib/api";
import { FitnessCard } from "@/components/fitness-card";
import { Pagination } from "@/components/pagination";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";

const PAGE_SIZE = 15;

/** 训练类型筛选选项（后端 type：strength|cardio|stretch，all 或空=全部） */
const TYPE_OPTIONS = [
  { value: "", label: "全部类型" },
  { value: "strength", label: "力量" },
  { value: "cardio", label: "有氧" },
  { value: "stretch", label: "拉伸" },
];

export function FitnessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [res, setRes] = useState<PaginatedResponse<FitnessRecord> | null>(null);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fitness
      .list({
        page,
        page_size: PAGE_SIZE,
        keyword: keyword || undefined,
        type: type || "all",
      })
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
    // 客户端复核模块开关（失败按开启处理，取 ALL_ENABLED 兜底）
    moduleConfig
      .get()
      .then((config) => {
        if (!cancelled) setModuleEnabled(config.fitness_enabled);
      })
      .catch(() => {
        if (!cancelled) setModuleEnabled(ALL_ENABLED.fitness_enabled);
      });
    return () => {
      cancelled = true;
    };
  }, [keyword, type, page, reloadKey]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const buildUrl = (params: { keyword?: string; type?: string; page?: number }) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (params.keyword !== undefined) {
      if (params.keyword) sp.set("keyword", params.keyword);
      else sp.delete("keyword");
    }
    if (params.type !== undefined) {
      if (params.type) sp.set("type", params.type);
      else sp.delete("type");
    }
    if (params.page !== undefined) {
      if (params.page > 1) sp.set("page", String(params.page));
      else sp.delete("page");
    }
    const query = sp.toString();
    return `/fitness${query ? `?${query}` : ""}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), page: 1 }));
  };

  const handleTypeChange = (value: string) => {
    router.push(buildUrl({ type: value, page: 1 }));
  };

  const handlePageChange = (p: number) => {
    router.push(buildUrl({ page: p }));
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="健身训练" />;
  }

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-hand text-3xl text-foreground sm:text-4xl">健身训练</h1>
            <p className="mt-2 text-muted-foreground">扛得动设备，也要扛得动自己</p>
          </div>

          <div className="flex w-full max-w-lg items-center gap-2">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索训练标题..."
                aria-label="搜索训练记录"
                className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </form>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              aria-label="训练类型筛选"
              className="h-11 cursor-pointer rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            加载中...
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title="训练记录加载失败"
              message={error}
              onRetry={() => setReloadKey((k) => k + 1)}
            />
          </div>
        ) : !res || res.list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">没有找到符合条件的训练记录</p>
          </div>
        ) : (
          <>
            <div className="mx-auto mt-8 max-w-4xl space-y-4">
              {res.list.map((record) => (
                <FitnessCard key={record.id} record={record} />
              ))}
            </div>
            {res.total_pages > 1 && (
              <div className="mt-10">
                <Pagination page={page} totalPages={res.total_pages} onPageChange={handlePageChange} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
