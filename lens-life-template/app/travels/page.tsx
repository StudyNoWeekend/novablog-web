import Link from "next/link";
import { Search } from "lucide-react";
import { getTravels } from "@/lib/api/travels";
import { getModuleConfig } from "@/lib/api/module-config";
import { TravelCard } from "@/components/TravelCard";
import { ModuleDisabled } from "@/components/ModuleDisabled";

export const dynamic = "force-dynamic";

interface SearchParams {
  keyword?: string;
  days_range?: string;
  sort?: string;
  page?: string;
}

const DAYS_OPTIONS = [
  { value: "", label: "全部天数" },
  { value: "1-3", label: "1-3 天" },
  { value: "4-7", label: "4-7 天" },
  { value: "8-14", label: "8-14 天" },
  { value: "15+", label: "15 天以上" },
];

const SORT_OPTIONS = [
  { value: "", label: "默认排序" },
  { value: "views", label: "最多浏览" },
  { value: "rating", label: "最高评分" },
  { value: "likes", label: "最多点赞" },
];

export default async function TravelsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const config = await getModuleConfig();
  if (!config.travel_enabled) {
    return <ModuleDisabled moduleLabel="旅行攻略" />;
  }

  const params = await searchParams;
  const currentPage = params.page ? Number(params.page) : 1;
  const activeDays = params.days_range ?? "";
  const activeSort = params.sort ?? "";

  const travelsData = await getTravels({
    keyword: params.keyword,
    days_range: activeDays,
    sort: activeSort,
    page: currentPage,
    page_size: 12,
  });

  const travels = travelsData.list;

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-playfair)] text-4xl font-bold text-text-primary md:text-5xl">
            旅行攻略
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            从雪山到大海，从城市到旷野。每一份攻略，都是用脚步丈量过的路线。
          </p>

          {/* Keyword Search */}
          <form
            action="/travels"
            method="GET"
            className="mx-auto mt-8 flex max-w-md items-center"
          >
            {activeDays && <input type="hidden" name="days_range" value={activeDays} />}
            {activeSort && <input type="hidden" name="sort" value={activeSort} />}
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="keyword"
                defaultValue={params.keyword ?? ""}
                placeholder="搜索目的地、标题..."
                aria-label="搜索旅行攻略"
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-background transition-colors duration-200 ease-out hover:bg-accent-hover"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-background/95 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {DAYS_OPTIONS.map((option) => {
              const isActive = activeDays === option.value;
              return (
                <Link
                  key={option.value || "all"}
                  href={buildHref({ ...params, days_range: option.value, page: "" })}
                  className={`min-h-9 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-accent text-background"
                      : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SORT_OPTIONS.map((option) => {
              const isActive = activeSort === option.value;
              return (
                <Link
                  key={option.value || "default"}
                  href={buildHref({ ...params, sort: option.value, page: "" })}
                  className={`min-h-9 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-accent-subtle text-accent"
                      : "text-text-subtle hover:text-text-primary"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Travel List */}
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {travels.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {travels.map((travel) => (
                  <TravelCard key={travel.id} travel={travel} />
                ))}
              </div>

              {/* Pagination */}
              {travelsData.total_pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={buildHref({ ...params, page: String(currentPage - 1) })}
                      className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                      上一页
                    </Link>
                  )}
                  <span className="px-4 text-sm text-text-muted">
                    {currentPage} / {travelsData.total_pages}
                  </span>
                  {currentPage < travelsData.total_pages && (
                    <Link
                      href={buildHref({ ...params, page: String(currentPage + 1) })}
                      className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                      下一页
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg text-text-muted">
                {params.keyword
                  ? `未找到与「${params.keyword}」相关的攻略`
                  : "暂无旅行攻略，敬请期待"}
              </p>
              <Link
                href="/travels"
                className="mt-4 cursor-pointer text-sm font-medium text-accent transition-colors duration-200 ease-out hover:text-accent-hover"
              >
                查看全部攻略
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function buildHref(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/travels?${qs}` : "/travels";
}
