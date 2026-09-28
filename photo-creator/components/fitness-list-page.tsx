"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { fitness, getModuleConfig, type FitnessRecord } from "@/lib/api";
import { FitnessCard } from "./fitness-card";
import { Pagination } from "./pagination";
import { ErrorState } from "./error-state";
import { ModuleDisabled } from "./module-disabled";
import { ModuleRowSkeleton } from "./module-skeleton";

const PAGE_SIZE = 15;

/** 训练类型筛选选项（后端 type：strength|cardio|stretch，all 或空=全部） */
const TYPE_OPTIONS = [
  { value: "", label: "全部类型" },
  { value: "strength", label: "力量" },
  { value: "cardio", label: "有氧" },
  { value: "stretch", label: "拉伸" },
];

const SELECT_CLASS =
  "h-10 cursor-pointer rounded-full border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

function FitnessListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";

  const [items, setItems] = useState<FitnessRecord[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const load = useCallback(
    async (currentPage: number, kw?: string, t?: string) => {
      setLoading(true);
      setError(null);
      try {
        const [res, modules] = await Promise.all([
          fitness.list({
            page: currentPage,
            page_size: PAGE_SIZE,
            keyword: kw || undefined,
            type: t || "all",
          }),
          getModuleConfig(),
        ]);
        setItems(res.list);
        setTotalPages(res.total_pages);
        setModuleEnabled(modules.fitness_enabled);
        if (currentPage > res.total_pages && res.total_pages > 0) {
          setPage(res.total_pages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载训练记录失败");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(page, keyword, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword, type]);

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
    return <ModuleDisabled moduleLabel="健身训练" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
      <div className="mb-10 md:mb-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">训练</p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          健身训练
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          每一次训练，都是与自己的对话。
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        <form onSubmit={handleSearchSubmit} className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索训练标题"
            aria-label="搜索训练记录"
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </form>
        <select
          value={type}
          onChange={(e) => updateQuery({ type: e.target.value })}
          aria-label="训练类型筛选"
          className={SELECT_CLASS}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <ModuleRowSkeleton count={6} variant="icon" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(page, keyword, type)} />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的训练记录
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-4xl space-y-4">
            {items.map((record) => (
              <FitnessCard key={record.id} record={record} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export function FitnessListPage() {
  return (
    <Suspense fallback={<ModuleRowSkeleton count={6} variant="icon" />}>
      <FitnessListContent />
    </Suspense>
  );
}
