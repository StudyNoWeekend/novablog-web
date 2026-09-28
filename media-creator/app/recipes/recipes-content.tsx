"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChefHat, Loader2, Search } from "lucide-react";
import { recipes, moduleConfig, ALL_ENABLED, type PaginatedResponse, type Recipe } from "@/lib/api";
import { RecipeCard } from "@/components/recipe-card";
import { Pagination } from "@/components/pagination";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";

const PAGE_SIZE = 12;

/** 难度筛选选项（后端 difficulty：1=简单 2=中等 3=困难） */
const DIFFICULTY_OPTIONS = [
  { value: "", label: "全部难度" },
  { value: "1", label: "简单" },
  { value: "2", label: "中等" },
  { value: "3", label: "困难" },
];

export function RecipesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [res, setRes] = useState<PaginatedResponse<Recipe> | null>(null);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    recipes
      .list({
        page,
        page_size: PAGE_SIZE,
        keyword: keyword || undefined,
        difficulty: difficulty ? Number(difficulty) : undefined,
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
        if (!cancelled) setModuleEnabled(config.recipe_enabled);
      })
      .catch(() => {
        if (!cancelled) setModuleEnabled(ALL_ENABLED.recipe_enabled);
      });
    return () => {
      cancelled = true;
    };
  }, [keyword, difficulty, page, reloadKey]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const buildUrl = (params: { keyword?: string; difficulty?: string; page?: number }) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (params.keyword !== undefined) {
      if (params.keyword) sp.set("keyword", params.keyword);
      else sp.delete("keyword");
    }
    if (params.difficulty !== undefined) {
      if (params.difficulty) sp.set("difficulty", params.difficulty);
      else sp.delete("difficulty");
    }
    if (params.page !== undefined) {
      if (params.page > 1) sp.set("page", String(params.page));
      else sp.delete("page");
    }
    const query = sp.toString();
    return `/recipes${query ? `?${query}` : ""}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), page: 1 }));
  };

  const handleDifficultyChange = (value: string) => {
    router.push(buildUrl({ difficulty: value, page: 1 }));
  };

  const handlePageChange = (p: number) => {
    router.push(buildUrl({ page: p }));
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="美食菜谱" />;
  }

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-hand text-3xl text-foreground sm:text-4xl">美食菜谱</h1>
            <p className="mt-2 text-muted-foreground">镜头之外，也要好好吃饭</p>
          </div>

          <div className="flex w-full max-w-lg items-center gap-2">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索菜谱名称..."
                aria-label="搜索菜谱"
                className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </form>
            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              aria-label="难度筛选"
              className="h-11 cursor-pointer rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
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
              title="菜谱加载失败"
              message={error}
              onRetry={() => setReloadKey((k) => k + 1)}
            />
          </div>
        ) : !res || res.list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <ChefHat className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">没有找到符合条件的菜谱</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {res.list.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
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
