"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GitFork, Loader2, Search } from "lucide-react";
import { openSources, moduleConfig, ALL_ENABLED, type PaginatedResponse, type OpenSource } from "@/lib/api";
import { OpenSourceCard } from "@/components/open-source-card";
import { Pagination } from "@/components/pagination";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";

const PAGE_SIZE = 12;

export function OpenSourceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [res, setRes] = useState<PaginatedResponse<OpenSource> | null>(null);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    openSources
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
    // 客户端复核模块开关（失败按开启处理，取 ALL_ENABLED 兜底）
    moduleConfig
      .get()
      .then((config) => {
        if (!cancelled) setModuleEnabled(config.open_source_enabled);
      })
      .catch(() => {
        if (!cancelled) setModuleEnabled(ALL_ENABLED.open_source_enabled);
      });
    return () => {
      cancelled = true;
    };
  }, [keyword, page, reloadKey]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const buildUrl = (params: { keyword?: string; page?: number }) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (params.keyword !== undefined) {
      if (params.keyword) sp.set("keyword", params.keyword);
      else sp.delete("keyword");
    }
    if (params.page !== undefined) {
      if (params.page > 1) sp.set("page", String(params.page));
      else sp.delete("page");
    }
    const query = sp.toString();
    return `/open-source${query ? `?${query}` : ""}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), page: 1 }));
  };

  const handlePageChange = (p: number) => {
    router.push(buildUrl({ page: p }));
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="开源作品" />;
  }

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-hand text-3xl text-foreground sm:text-4xl">开源作品</h1>
            <p className="mt-2 text-muted-foreground">把想法变成代码，回馈开源世界</p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索项目名称、简介..."
                aria-label="搜索开源作品"
                className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              搜索
            </button>
          </form>
        </div>

        {keyword && !loading && (
          <div className="mt-4 text-sm text-muted-foreground">
            {res && res.total > 0
              ? `找到 ${res.total} 个与 "${keyword}" 相关的项目`
              : `未找到与 "${keyword}" 相关的项目`}
          </div>
        )}

        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            加载中...
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title="开源作品加载失败"
              message={error}
              onRetry={() => setReloadKey((k) => k + 1)}
            />
          </div>
        ) : !res || res.list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <GitFork className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">没有找到符合条件的开源作品</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {res.list.map((project) => (
                <OpenSourceCard key={project.id} project={project} />
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
