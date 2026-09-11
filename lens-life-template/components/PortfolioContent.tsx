"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Loader2, Images } from "lucide-react";
import { getPortfolios } from "@/lib/api/portfolios";
import { PortfolioViewer } from "@/components/PortfolioViewer";
import type { Portfolio } from "@/lib/types";

export function PortfolioContent() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    setLoading(true);
    const data = await getPortfolios({ page: 1, page_size: 100 });
    setPortfolios(data.list);
    setLoading(false);
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const categoryOptions = useMemo(() => {
    const seen = new Map<string, string>();
    portfolios.forEach((p) => {
      if (p.category_id && p.category_name && !seen.has(p.category_id)) {
        seen.set(p.category_id, p.category_name);
      }
    });
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [portfolios]);

  const filtered = activeCategory
    ? portfolios.filter((p) => p.category_id === activeCategory)
    : portfolios;

  const activePortfolio = portfolios.find((p) => p.id === activeId) || null;

  return (
    <div className="flex-1 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="font-[var(--font-heading)] text-4xl font-medium text-text-primary sm:text-5xl">
            作品集
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            光影的切片 —— 从雪山之巅到城市街头，记录那些转瞬即逝的瞬间。
          </p>
        </header>

        {/* Category filters (derived from data) */}
        {categoryOptions.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              aria-pressed={activeCategory === ""}
              className={`min-h-11 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                activeCategory === ""
                  ? "bg-accent text-background"
                  : "border border-border bg-surface text-text-secondary hover:border-accent/40 hover:text-text-primary"
              }`}
            >
              全部
            </button>
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={activeCategory === category.id}
                className={`min-h-11 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                  activeCategory === category.id
                    ? "bg-accent text-background"
                    : "border border-border bg-surface text-text-secondary hover:border-accent/40 hover:text-text-primary"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Gallery */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-radius-md bg-surface shadow-card"
                style={{ aspectRatio: "4 / 3" }}
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onClick={() => setActiveId(portfolio.id)}
              />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-text-muted">
            {activeCategory ? "该分类下暂无作品。" : "暂无作品，敬请期待。"}
          </p>
        )}
      </div>

      {activeId && (
        <PortfolioViewer
          portfolioId={activeId}
          portfolioName={activePortfolio?.name}
          onClose={() => setActiveId(null)}
        />
      )}
    </div>
  );
}

function PortfolioCard({
  portfolio,
  onClick,
}: {
  portfolio: Portfolio;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-radius-md bg-surface shadow-card transition-all duration-300 ease-out hover:shadow-card-hover hover:ring-1 hover:ring-accent/30"
      role="button"
      tabIndex={0}
      aria-label={`预览 ${portfolio.name}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {portfolio.cover_url ? (
        <Image
          src={portfolio.cover_url}
          alt={portfolio.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-background-soft">
          <Images className="h-8 w-8 text-text-subtle" strokeWidth={1.5} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        {portfolio.category_name && (
          <span className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-text-secondary backdrop-blur-sm">
            {portfolio.category_name}
          </span>
        )}
        <h3 className="font-[var(--font-heading)] text-lg font-medium text-white">
          {portfolio.name}
        </h3>
        <div className="mt-1 flex translate-y-2 items-center gap-1.5 text-sm text-white/70 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <Images className="h-3.5 w-3.5" />
          <span>{portfolio.item_count} 张作品</span>
          <span className="text-xs text-white/40">· 点击预览</span>
        </div>
      </div>
    </div>
  );
}
