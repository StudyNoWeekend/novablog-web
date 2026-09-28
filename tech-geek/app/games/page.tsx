"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { games, getModuleConfig, Game, PaginatedResponse } from "@/lib/api";
import { GameCard } from "@/components/game-card";
import { Pagination } from "@/components/pagination";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

/** 游玩状态筛选选项（后端 play_status：want|playing|played，all 或空=全部） */
const PLAY_STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "want", label: "想玩" },
  { value: "playing", label: "在玩" },
  { value: "played", label: "玩过" },
];

function GamesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("keyword") || "";
  const playStatus = searchParams.get("play_status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [result, setResult] = useState<PaginatedResponse<Game> | null>(null);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(keyword);

  const buildUrl = useCallback(
    (params: { keyword?: string; play_status?: string; page?: number }) => {
      const sp = new URLSearchParams();
      if (params.keyword) sp.set("keyword", params.keyword);
      if (params.play_status) sp.set("play_status", params.play_status);
      if (params.page && params.page > 1) sp.set("page", String(params.page));
      const query = sp.toString();
      return `/games${query ? `?${query}` : ""}`;
    },
    []
  );

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        games.list({
          page,
          page_size: PAGE_SIZE,
          keyword: keyword || undefined,
          play_status: playStatus || "all",
        }),
        getModuleConfig(),
      ]);
      setResult(res);
      setModuleEnabled(modules.game_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载游戏库失败");
    } finally {
      setLoading(false);
    }
  }, [page, keyword, playStatus]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ keyword: searchValue.trim(), play_status: playStatus, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    router.push(buildUrl({ keyword, play_status: value, page: 1 }));
  };

  if (!loading && !moduleEnabled) {
    return <ModuleDisabled moduleLabel="游戏库" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            游戏库
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">共 {result?.total ?? 0} 款游戏</p>
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
              placeholder="搜索游戏名称..."
              className="pl-9"
              aria-label="搜索游戏"
            />
          </form>
          <select
            value={playStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            aria-label="游玩状态筛选"
            className="h-8 cursor-pointer rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {PLAY_STATUS_OPTIONS.map((opt) => (
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
        <Loading text="加载游戏库中..." />
      ) : error ? (
        <ErrorState title="游戏库加载失败" message={error} onRetry={fetchGames} />
      ) : !result || result.list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的游戏
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.list.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={page}
              totalPages={result.total_pages}
              baseUrl={buildUrl({ keyword, play_status: playStatus })}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<CardGridSkeleton />}>
      <GamesPageContent />
    </Suspense>
  );
}
