"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import { getPortfolioDetail } from "@/lib/api/portfolios";
import type { PortfolioDetail } from "@/lib/types";

interface PortfolioViewerProps {
  portfolioId: string;
  portfolioName?: string;
  onClose: () => void;
}

const WHEEL_COOLDOWN_MS = 350;
const SWIPE_THRESHOLD_PX = 48;

export function PortfolioViewer({
  portfolioId,
  portfolioName,
  onClose,
}: PortfolioViewerProps) {
  const [detail, setDetail] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [index, setIndex] = useState(0);
  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    const data = await getPortfolioDetail(portfolioId);
    if (data) {
      setDetail(data);
    } else {
      setLoadError(true);
    }
    setLoading(false);
  }, [portfolioId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const items = detail?.items ?? [];
  const total = items.length;
  const current = items[Math.min(index, Math.max(total - 1, 0))];

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + Math.max(total, 1)) % Math.max(total, 1));
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(total, 1));
  }, [total]);

  // Body scroll lock + keyboard navigation
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, goPrev, goNext]);

  // Mouse wheel / trackpad navigation (throttled)
  const handleWheel = (event: React.WheelEvent) => {
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
      ? event.deltaY
      : event.deltaX;
    if (Math.abs(delta) < 8 || wheelLockRef.current) return;
    wheelLockRef.current = true;
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, WHEEL_COOLDOWN_MS);
    if (delta > 0) goNext();
    else goPrev();
  };

  // Touch swipe navigation
  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();
  const isVideo = current?.mime_type?.startsWith("video/");

  return (
    <div
      className="animate-overlay-fade-in fixed inset-0 z-[60] flex cursor-pointer flex-col bg-black/70 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={portfolioName || "作品集预览"}
    >
      {/* Top bar */}
      <div
        className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-6"
        onClick={stopPropagation}
      >
        <div className="flex min-w-0 items-center gap-2 text-sm text-white/80">
          <Images className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
          <span className="truncate">
            {portfolioName || detail?.name || "作品集"}
          </span>
          {detail?.category_name && (
            <span className="hidden rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs text-white/80 sm:inline-block">
              {detail.category_name}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {total > 0 && (
            <span className="text-sm tabular-nums text-white/60">
              {Math.min(index + 1, total)} / {total}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭预览"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 ease-out hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main media area */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 md:px-4"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onClose}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3" onClick={stopPropagation}>
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-sm text-white/70">正在加载作品...</p>
          </div>
        ) : loadError ? (
          <div
            className="flex flex-col items-center gap-3"
            onClick={stopPropagation}
          >
            <p className="text-sm text-white/70">作品加载失败</p>
            <button
              type="button"
              onClick={fetchDetail}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-4 text-sm text-white transition-colors duration-200 hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              重新加载
            </button>
          </div>
        ) : total === 0 ? (
          <p className="text-sm text-white/70" onClick={stopPropagation}>
            该作品集暂无内容
          </p>
        ) : (
          <>
            {/* Prev / Next arrows */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    stopPropagation(event);
                    goPrev();
                  }}
                  aria-label="上一张"
                  className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 ease-out hover:bg-white/25 md:left-6"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    stopPropagation(event);
                    goNext();
                  }}
                  aria-label="下一张"
                  className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 ease-out hover:bg-white/25 md:right-6"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
                </button>
              </>
            )}

            {/* Media */}
            <div
              key={current.id}
              className="animate-overlay-fade-in relative flex h-full w-full max-w-5xl cursor-default items-center justify-center"
              onClick={stopPropagation}
            >
              {isVideo ? (
                <video
                  key={current.id}
                  src={current.output_url}
                  controls
                  playsInline
                  className="max-h-[68vh] max-w-full rounded-radius-md"
                />
              ) : (
                <div className="relative h-[68vh] w-full">
                  <Image
                    src={current.output_url}
                    alt={current.title || `${portfolioName || "作品"} ${index + 1}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 1024px"
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Caption + thumbnails */}
      {!loading && !loadError && total > 0 && current && (
        <div
          className="shrink-0 px-4 pb-5 pt-3 text-center"
          onClick={stopPropagation}
        >
          {current.title && (
            <h2 className="font-[var(--font-playfair)] text-lg font-medium text-white md:text-xl">
              {current.title}
            </h2>
          )}
          {current.description && (
            <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-relaxed text-white/70">
              {current.description}
            </p>
          )}

          {total > 1 && (
            <div className="no-scrollbar mx-auto mt-4 flex max-w-full items-center gap-2 overflow-x-auto pb-1 md:justify-center">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`查看第 ${i + 1} 张`}
                  aria-current={i === index}
                  className={`relative h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded-sm transition-all duration-200 ${
                    i === index
                      ? "ring-2 ring-accent"
                      : "opacity-50 hover:opacity-90"
                  }`}
                >
                  {item.mime_type?.startsWith("video/") ? (
                    <div className="flex h-full w-full items-center justify-center bg-white/10 text-white">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  ) : (
                    <Image
                      src={item.output_url}
                      alt={item.title || `缩略图 ${i + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
