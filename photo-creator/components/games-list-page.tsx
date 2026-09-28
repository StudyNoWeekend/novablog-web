"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { games, getModuleConfig, type Game } from "@/lib/api";
import { GameCard } from "./game-card";
import { Pagination } from "./pagination";
import { ErrorState } from "./error-state";
import { ModuleDisabled } from "./module-disabled";
import { ArticleGridSkeleton } from "./loading";

const PAGE_SIZE = 12;

/** 游玩状态筛选选项（后端 play_status：want|playing|played，all 或空=全部） */
const PLAY_STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "want", label: "想玩" },
  { value: "playing", label: "在玩" },
  { value: "played", label: "玩过" },
];

const SELECT_CLASS =
  "h-10 cursor-pointer rounded-full border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

function GamesListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const keyword = searchParams.get("keyword") || "";
  const playStatus = searchParams.get("play_status") || "";

  const [items, setItems] = useState<Game[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const load = useCallback(
    async (currentPage: number, kw?: string, status?: string) => {
      setLoading(true);
      setError(null);
      try {
        const [res, modules] = await Promise.all([
          games.list({
            page: currentPage,
            page_size: PAGE_SIZE,
            keyword: kw || undefined,
            play_status: status || "all",
          }),
          getModuleConfig(),
        ]);
        setItems(res.list);
        setTotalPages(res.total_pages);
        setModuleEnabled(modules.game_enabled);
        if (currentPage > res.total_pages && res.total_pages > 0) {
          setPage(res.total_pages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载游戏库失败");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(page, keyword, playStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword, playStatus]);

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
    return <ModuleDisabled moduleLabel="游戏库" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
      <div className="mb-10 md:mb-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">游戏</p>
        <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
          游戏库
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          玩过的游戏与片刻感想。
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        <form onSubmit={handleSearchSubmit} className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="搜索游戏名称"
            aria-label="搜索游戏"
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </form>
        <select
          value={playStatus}
          onChange={(e) => updateQuery({ play_status: e.target.value })}
          aria-label="游玩状态筛选"
          className={SELECT_CLASS}
        >
          {PLAY_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <ArticleGridSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(page, keyword, playStatus)} />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的游戏
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export function GamesListPage() {
  return (
    <Suspense fallback={<ArticleGridSkeleton count={6} />}>
      <GamesListContent />
    </Suspense>
  );
}
