"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CatFace, Sparkle } from "@/components/ComicDoodle";
import {
  getPortfolios,
  getPortfolioById,
} from "@/lib/api/portfolios";
import type { Portfolio, PortfolioItem } from "@/lib/types";

/** 作品详情弹层：封面分格 + 点击查看大图（左右切换） */
export function PortfolioViewer({
  portfolioId,
  portfolioName,
  onClose,
}: {
  portfolioId: string;
  portfolioName?: string;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<Portfolio & { items?: PortfolioItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPortfolioById(portfolioId).then((data) => {
      if (cancelled) return;
      setDetail(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [portfolioId]);

  const items = useMemo(() => detail?.items ?? [], [detail]);

  // Esc 关闭 / 大图左右切换
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeIndex !== null) setActiveIndex(null);
        else onClose();
      }
      if (activeIndex === null) return;
      if (event.key === "ArrowRight") {
        setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((i) =>
          i === null ? null : (i - 1 + items.length) % items.length
        );
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, items.length, onClose]);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-ink/85 backdrop-blur-sm animate-[overlayFadeIn_0.2s_ease-out_forwards] motion-reduce:animate-none"
      role="dialog"
      aria-modal="true"
      aria-label={`作品集 ${portfolioName || ""}`}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <h2 className="font-display text-lg text-accent sm:text-xl">
          《{detail?.name || portfolioName || "作品集"}》
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭预览"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/85 transition-colors duration-200 hover:bg-white/20 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* 内容 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        {loading ? (
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-radius-md bg-white/10" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`查看 ${item.title || `第 ${index + 1} 张`}`}
                className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-radius-md bg-white/10"
              >
                {item.output_url ? (
                  <Image
                    src={item.output_url}
                    alt={item.title || `作品 ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    <CatFace className="h-8 w-8 text-white/40" />
                  </span>
                )}
                {item.title && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-left text-xs text-white/90">
                    {item.title}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-sm text-white/70">
            这个作品集还没有上传作品。
          </p>
        )}
      </div>

      {/* 大图查看 */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95 animate-[overlayFadeIn_0.2s_ease-out_forwards] motion-reduce:animate-none"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title || "作品大图"}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white/85">
            <p className="text-sm">
              {activeItem.title || "未命名"} · {(activeIndex ?? 0) + 1} / {items.length}
            </p>
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="返回作品集"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-colors duration-200 hover:bg-white/20"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-10 sm:px-24">
            {activeItem.output_url ? (
              <Image
                src={activeItem.output_url}
                alt={activeItem.title || `作品 ${(activeIndex ?? 0) + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <CatFace className="h-16 w-16 text-white/40" />
            )}

            {/* 左右切换 */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((i) =>
                      i === null ? null : (i - 1 + items.length) % items.length
                    )
                  }
                  aria-label="上一张"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/25"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((i) => (i === null ? null : (i + 1) % items.length))
                  }
                  aria-label="下一张"
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/25"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {activeItem.description && (
            <p className="flex items-center justify-center gap-2 pb-6 text-center text-sm text-white/70">
              <Sparkle className="h-3.5 w-3.5 text-accent" />
              {activeItem.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** 作品页：分类筛选 + 作品分格 + 弹层预览 */
export function PortfolioContent() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPortfolios({ page: 1, page_size: 100 }).then((data) => {
      if (cancelled) return;
      setPortfolios(data.list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
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
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <p className="font-hand text-2xl text-accent-hover">My Comic Works</p>
          <h1 className="mt-1 font-display text-4xl text-text-primary md:text-5xl">
            漫画作品
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            每一部作品都是一扇小窗，推开会看到不同的世界
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
                  ? "bg-ink text-accent"
                  : "border border-border bg-surface text-text-secondary hover:border-accent/50 hover:text-text-primary"
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
                    ? "bg-ink text-accent"
                    : "border border-border bg-surface text-text-secondary hover:border-accent/50 hover:text-text-primary"
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
                className="aspect-[4/3] animate-pulse rounded-radius-md bg-background-soft"
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
          <div className="flex flex-col items-center py-20 text-center">
            <CatFace className="h-14 w-14 -rotate-6 text-text-subtle" />
            <p className="mt-4 text-text-muted">
              {activeCategory ? "该分类下暂无作品。" : "暂无作品，敬请期待。"}
            </p>
          </div>
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
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-radius-md border-2 border-ink bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
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
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-background-soft">
          <CatFace className="h-10 w-10 text-text-subtle" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        {portfolio.category_name && (
          <span className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-accent backdrop-blur-sm">
            {portfolio.category_name}
          </span>
        )}
        <h3 className="font-display text-lg text-white">
          《{portfolio.name}》
        </h3>
        <div className="mt-1 flex translate-y-2 items-center gap-1.5 text-sm text-white/70 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <Sparkle className="h-3.5 w-3.5 text-accent" />
          <span>{portfolio.item_count} 张作品</span>
          <span className="text-xs text-white/40">· 点击预览</span>
        </div>
      </div>
    </div>
  );
}
