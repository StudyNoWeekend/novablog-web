"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { recipes, getModuleConfig, Recipe, PaginatedResponse } from "@/lib/api";
import { RecipeCard } from "@/components/recipe-card";
import { Pagination } from "@/components/pagination";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

/** 难度筛选选项（后端 difficulty：1=简单 2=中等 3=困难） */
const DIFFICULTY_OPTIONS = [
  { value: "", label: "全部难度" },
  { value: "1", label: "简单" },
  { value: "2", label: "中等" },
  { value: "3", label: "困难" },
];

function RecipesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [result, setResult] = useState<PaginatedResponse<Recipe> | null>(null);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const buildUrl = useCallback(
    (params: { keyword?: string; difficulty?: string; page?: number }) => {
      const sp = new URLSearchParams();
      if (params.keyword) sp.set("keyword", params.keyword);
      if (params.difficulty) sp.set("difficulty", params.difficulty);
      if (params.page && params.page > 1) sp.set("page", String(params.page));
      const query = sp.toString();
      return `/recipes${query ? `?${query}` : ""}`;
    },
    []
  );

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        recipes.list({
          page,
          page_size: PAGE_SIZE,
          keyword: keyword || undefined,
          difficulty: difficulty ? Number(difficulty) : undefined,
        }),
        getModuleConfig(),
      ]);
      setResult(res);
      setModuleEnabled(modules.recipe_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载菜谱失败");
    } finally {
      setLoading(false);
    }
  }, [page, keyword, difficulty]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), difficulty, page: 1 }));
  };

  const handleDifficultyChange = (value: string) => {
    router.push(buildUrl({ keyword, difficulty: value, page: 1 }));
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="美食菜谱" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            美食菜谱
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">共 {result?.total ?? 0} 道菜谱</p>
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
              placeholder="搜索菜谱名称、食材..."
              className="pl-9"
              aria-label="搜索菜谱"
            />
          </form>
          <select
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            aria-label="难度筛选"
            className="h-8 cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
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
        <Loading text="加载菜谱中..." />
      ) : error ? (
        <ErrorState title="菜谱加载失败" message={error} onRetry={fetchRecipes} />
      ) : !result || result.list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的菜谱
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.list.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={page}
              totalPages={result.total_pages}
              baseUrl={buildUrl({ keyword, difficulty })}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<CardGridSkeleton />}>
      <RecipesPageContent />
    </Suspense>
  );
}
