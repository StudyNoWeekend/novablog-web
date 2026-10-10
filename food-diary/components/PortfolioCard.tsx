"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Images } from "lucide-react";
import type { Portfolio } from "@/lib/types";

interface PortfolioCardProps {
  portfolio: Portfolio;
}

/** 作品集卡片：封面 + 名称 + 分类 + 作品数 */
export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolio/${portfolio.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* 封面 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-background-soft">
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
          <div className="flex h-full items-center justify-center text-text-subtle">
            <Images className="h-10 w-10" strokeWidth={1.2} aria-hidden="true" />
          </div>
        )}
        {portfolio.category_name && (
          <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-0.5 text-xs font-medium text-accent-hover shadow-card backdrop-blur-sm">
            {portfolio.category_name}
          </span>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
            {portfolio.name}
          </h3>
          {portfolio.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
              {portfolio.description}
            </p>
          )}
          <p className="mt-2 text-xs text-text-subtle">
            {portfolio.item_count} 个作品
          </p>
        </div>
        <ChevronRight
          className="mt-1 h-4 w-4 shrink-0 text-text-subtle transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-accent-hover"
          strokeWidth={1.8}
        />
      </div>
    </Link>
  );
}
