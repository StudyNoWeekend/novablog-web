"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ImageIcon } from "lucide-react";
import type { PortfolioDetail } from "@/lib/api";
import { Lightbox } from "./lightbox";

interface PortfolioDetailPageProps {
  portfolio: PortfolioDetail;
}

export function PortfolioDetailPage({ portfolio }: PortfolioDetailPageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxItems = useMemo(
    () =>
      portfolio.items.map((item) => ({
        src: item.output_url,
        alt: item.title,
        title: item.title,
        description: item.description,
      })),
    [portfolio.items]
  );

  const year = new Date(portfolio.created_at).getFullYear();
  const coverUrl = portfolio.cover_url || portfolio.items[0]?.output_url;

  return (
    <div className="bg-background text-foreground">
      {/* Full-screen cover Hero */}
      <section className="relative -mt-16 h-screen w-full overflow-hidden">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt=""
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

        <Link
          href="/portfolios"
          className="absolute left-4 top-24 z-20 inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm text-white/80 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-ring sm:left-6"
        >
          <ArrowLeft className="size-4" />
          返回作品集
        </Link>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl font-normal text-white md:text-6xl lg:text-7xl">
            {portfolio.name}
          </h1>

          {portfolio.description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
              {portfolio.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-white/80">
            {portfolio.category_name && <span>{portfolio.category_name}</span>}
            <span>{year}</span>
            <span>{portfolio.item_count} 张</span>
          </div>
        </div>

        <a
          href="#portfolio-gallery"
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 rounded-md text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>向下滚动</span>
          <ChevronDown className="size-5 transition-transform duration-700 hover:translate-y-1" />
        </a>
      </section>

      {/* Masonry gallery */}
      <section
        id="portfolio-gallery"
        className="scroll-mt-16 bg-background px-4 py-12 sm:px-6 md:py-20 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          {portfolio.items.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card py-20 text-center">
              <ImageIcon className="mx-auto size-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">作品集暂无图片</p>
            </div>
          ) : (
            <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
              {portfolio.items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={item.title ? `查看 ${item.title}` : `查看作品 ${idx + 1}`}
                  className="group mb-4 block w-full cursor-pointer overflow-hidden rounded-xl bg-card text-left break-inside-avoid focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative">
                    <Image
                      src={item.output_url}
                      alt={item.title || `作品 ${idx + 1}`}
                      width={800}
                      height={600}
                      unoptimized
                      className="w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                    {(item.title || item.description) && (
                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                        {item.title && (
                          <p className="text-sm font-medium text-white">{item.title}</p>
                        )}
                        {item.description && (
                          <p className="mt-1 text-xs text-white/80 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          items={lightboxItems}
          current={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex((i) =>
              i === null ? 0 : i === 0 ? lightboxItems.length - 1 : i - 1
            )
          }
          onNext={() =>
            setLightboxIndex((i) =>
              i === null ? 0 : i === lightboxItems.length - 1 ? 0 : i + 1
            )
          }
        />
      )}
    </div>
  );
}
