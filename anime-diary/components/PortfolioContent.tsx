"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, Loader2, X } from "lucide-react";
import { getPortfolios, getPortfolioDetail } from "@/lib/api/portfolios";
import { categoryBadgeStyle } from "@/components/ArticleCard";
import type { Portfolio, PortfolioDetail } from "@/lib/types";

/**
 * 作品页：封面墙 + 弹层浏览。
 * 点击作品集卡片拉取详情，弹层内网格浏览作品项，点项进入大图灯箱（左右切换）。
 */
export function PortfolioContent() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  const [active, setActive] = useState<PortfolioDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPortfolios({ page: 1, page_size: 50 }).then((data) => {
      if (cancelled) return;
      setPortfolios(data.list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openPortfolio = useCallback((portfolio: Portfolio) => {
    setActive(null);
    setLightboxIndex(null);
    setDetailLoading(true);
    getPortfolioDetail(portfolio.id).then((detail) => {
      setActive(detail);
      setDetailLoading(false);
    });
  }, []);

  const closeOverlay = useCallback(() => {
    setActive(null);
    setLightboxIndex(null);
  }, []);

  // 灯箱键盘导航 + 弹层打开时锁定页面滚动
  useEffect(() => {
    if (lightboxIndex == null) return;
    const items = active?.items ?? [];
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) =>
          i == null ? i : (i - 1 + items.length) % items.length
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i == null ? i : (i + 1) % items.length));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, active]);

  useEffect(() => {
    if (active || lightboxIndex != null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active, lightboxIndex]);

  const items = active?.items ?? [];
  const lightboxItem = lightboxIndex != null ? items[lightboxIndex] : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-radius-lg bg-surface"
            />
          ))}
        </div>
      ) : portfolios.length === 0 ? (
        <div className="rounded-radius-md border border-dashed border-border py-20 text-center">
          <Images className="mx-auto h-10 w-10 text-text-subtle" strokeWidth={1.5} />
          <p className="mt-4 font-heading text-text-muted">
            还没有上传作品，敬请期待～
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <button
              key={portfolio.id}
              type="button"
              onClick={() => openPortfolio(portfolio)}
              className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-radius-lg border border-border bg-surface text-left shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
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
                  <Images className="h-8 w-8 text-text-subtle" strokeWidth={1.5} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-center gap-2">
                  {portfolio.category_name && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${categoryBadgeStyle(portfolio.category_id)}`}
                    >
                      {portfolio.category_name}
                    </span>
                  )}
                  <span className="text-[11px] text-white/70">
                    {portfolio.item_count} 张
                  </span>
                </div>
                <h3 className="mt-1.5 font-heading text-lg text-white">
                  {portfolio.name}
                </h3>
                {portfolio.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/75">
                    {portfolio.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 作品集弹层 */}
      {(detailLoading || active) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active?.name || "作品集"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 p-4 backdrop-blur-sm"
          onClick={closeOverlay}
        >
          <div
            className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-radius-lg bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="min-w-0">
                <h3 className="truncate font-heading text-xl text-text-primary">
                  {active?.name || "加载中…"}
                </h3>
                {active?.description && (
                  <p className="mt-0.5 truncate text-xs text-text-muted">
                    {active.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeOverlay}
                aria-label="关闭"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-200 hover:bg-background-soft hover:text-text-primary"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {detailLoading ? (
                <div className="flex h-40 items-center justify-center text-text-muted">
                  <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.5} />
                </div>
              ) : items.length === 0 ? (
                <p className="py-12 text-center text-sm text-text-muted">
                  这个作品集还没有内容～
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-radius-md bg-background-soft"
                      aria-label={item.title || `查看第 ${index + 1} 张作品`}
                    >
                      {item.output_url ? (
                        <Image
                          src={item.output_url}
                          alt={item.title || ""}
                          fill
                          sizes="(max-width: 640px) 50vw, 30vw"
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      {item.title && (
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent px-2 pb-1.5 pt-6 text-left text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          {item.title}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 大图灯箱 */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title || "作品预览"}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-night/95 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* 上一张 / 下一张 */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="上一张"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (i) => (i == null ? i : (i - 1 + items.length) % items.length)
                  );
                }}
                className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="下一张"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (i) => (i == null ? i : (i + 1) % items.length)
                  );
                }}
                className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </>
          )}

          <figure
            className="flex max-h-full max-w-full flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxItem.output_url}
              alt={lightboxItem.title || ""}
              className="max-h-[78vh] max-w-full rounded-radius-md object-contain"
            />
            <figcaption className="flex items-center gap-3 text-sm text-white/85">
              <span>{lightboxItem.title || ""}</span>
              <span className="text-xs tabular-nums text-white/50">
                {lightboxIndex != null ? lightboxIndex + 1 : 0} / {items.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="关闭预览"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}
