"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { techStacks, getModuleConfig, type TechStack } from "@/lib/api";
import { TechStackCard } from "./tech-stack-card";
import { Pagination } from "./pagination";
import { ErrorState } from "./error-state";
import { ModuleDisabled } from "./module-disabled";
import { ArticleGridSkeleton } from "./loading";

const PAGE_SIZE = 12;

/** 熟练度筛选选项（后端 level：1=了解 2=熟悉 3=熟练 4=精通） */
const LEVEL_OPTIONS = [
  { value: "", label: "全部熟练度" },
  { value: "1", label: "了解" },
  { value: "2", label: "熟悉" },
  { value: "3", label: "熟练" },
  { value: "4", label: "精通" },
];

const SELECT_CLASS =
  "h-10 cursor-pointer rounded-full border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

function TechStackListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const keyword = searchParams.get("keyword") || "";
  const level = searchParams.get("level") || "";

  const [items, setItems] = useState<TechStack[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const load = useCallback(
    async (currentPage: number, kw?: string, lv?: string) => {
      setLoading(true);
      setError(null);
      try {
        const [res, modules] = await Promise.all([
          techStacks.list({
            page: currentPage,
            page_size: PAGE_SIZE,
            keyword: kw || undefined,
            level: lv ? Number(lv) : undefined,
          }),
          getModuleConfig(),
        ]);
        setItems(res.list);
        setTotalPages(res.total_pages);
        setModuleEnabled(modules.tech_stack_enabled);
        if (currentPage > res.total_pages && res.total_pages > 0) {
          setPage(res.total_pages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载技术栈失败");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(page, keyword, level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword, level]);

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
    return <ModuleDisabled moduleLabel="技术栈" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
      <div className="mb-10 md:mb-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">技艺</p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          技术栈
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          日常使用的工具与技术，以及熟练程度。
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        <form onSubmit={handleSearchSubmit} className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索技术名称、分类"
            aria-label="搜索技术栈"
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </form>
        <select
          value={level}
          onChange={(e) => updateQuery({ level: e.target.value })}
          aria-label="熟练度筛选"
          className={SELECT_CLASS}
        >
          {LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <ArticleGridSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(page, keyword, level)} />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的技术
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((stack) => (
              <TechStackCard key={stack.id} stack={stack} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export function TechStackListPage() {
  return (
    <Suspense fallback={<ArticleGridSkeleton count={6} />}>
      <TechStackListContent />
    </Suspense>
  );
}
