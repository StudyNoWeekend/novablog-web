"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxItem {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  current: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({ items, current, onClose, onPrev, onNext }: LightboxProps) {
  const item = items[current];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="图片预览"
    >
      <button
        type="button"
        aria-label="关闭预览"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
      >
        <X className="size-5" />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="上一张"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="下一张"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      <div
        className="flex max-h-screen w-full max-w-6xl flex-col items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[80vh] w-full">
          <Image
            src={item.src}
            alt={item.alt ?? item.title ?? "作品图片"}
            width={1600}
            height={1200}
            unoptimized
            className="mx-auto max-h-[80vh] w-auto object-contain"
            priority
          />
        </div>

        {(item.title || item.description) && (
          <div className="mt-4 max-w-2xl text-center text-white">
            {item.title && <p className="text-base font-medium">{item.title}</p>}
            {item.description && <p className="mt-1 text-sm text-white/70">{item.description}</p>}
          </div>
        )}

        <div className="mt-3 text-xs text-white/50">
          {current + 1} / {items.length}
        </div>
      </div>
    </div>
  );
}
