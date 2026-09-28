"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { recipes, getModuleConfig, type Recipe } from "@/lib/api";
import { RecipeCard } from "./recipe-card";
import { Pagination } from "./pagination";
import { ErrorState } from "./error-state";
import { ModuleDisabled } from "./module-disabled";
import { ArticleGridSkeleton } from "./loading";

const PAGE_SIZE = 12;

/** 难度筛选选项（后端 difficulty：1=简单 2=中等 3=困难） */
const DIFFICULTY_OPTIONS = [
  { value: "", label: "全部难度" },
  { value: "1", label: "简单" },
  { value: "2", label: "中等" },
  { value: "3", label: "困难" },
];

const SELECT_CLASS =
  "h-10 cursor-pointer rounded-full border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

function RecipesListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const keyword = searchParams.get("keyword") || "";
  const difficulty = searchParams.get("difficulty") || "";

  const [items, setItems] = useState<Recipe[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const load = useCallback(
    async (currentPage: number, kw?: string, diff?: string) => {
      setLoading(true);
      setError(null);
      try {
        const [res, modules] = await Promise.all([
          recipes.list({
            page: currentPage,
            page_size: PAGE_SIZE,
            keyword: kw || undefined,
            difficulty: diff ? Number(diff) : undefined,
          }),
          getModuleConfig(),
        ]);
        setItems(res.list);
        setTotalPages(res.total_pages);
        setModuleEnabled(modules.recipe_enabled);
        if (currentPage > res.total_pages && res.total_pages > 0) {
          setPage(res.total_pages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载菜谱失败");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(page, keyword, difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword, difficulty]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
    // 筛选变化回到第 1 页（与 searchParams 更新合并为一次渲染，effect 只触发一次请求）
    if (page !== 1) setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ keyword: searchValue.trim() });
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="美食菜谱" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
      <div className="mb-10 md:mb-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">厨房</p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          美食菜谱
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          一日三餐的记录，认真做饭，好好吃饭。
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        <form onSubmit={handleSearchSubmit} className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索菜谱名称、食材"
            aria-label="搜索菜谱"
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </form>
        <select
          value={difficulty}
          onChange={(e) => updateQuery({ difficulty: e.target.value })}
          aria-label="难度筛选"
          className={SELECT_CLASS}
        >
          {DIFFICULTY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <ArticleGridSkeleton count={9} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(page, keyword, difficulty)} />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的菜谱
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export function RecipesListPage() {
  return (
    <Suspense fallback={<ArticleGridSkeleton count={9} />}>
      <RecipesListContent />
    </Suspense>
  );
}
