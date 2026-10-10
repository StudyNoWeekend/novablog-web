"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Images } from "lucide-react";
import { getFileUrl } from "@/lib/api/client";
import type { Portfolio } from "@/lib/types";

interface PortfolioCardProps {
  portfolio: Portfolio;
}

/** 作品集卡片：封面 + 名称 + 分类 + 作品数 */
export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolio/${portfolio.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      {/* 封面 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        {portfolio.cover_url ? (
          <Image
            src={getFileUrl(portfolio.cover_url)}
            alt={portfolio.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(100%_120%_at_50%_0%,#1d2f26_0%,#16211c_70%)]">
            <Images className="h-9 w-9 text-accent/40" strokeWidth={1.2} />
          </div>
        )}
        {portfolio.category_name && (
          <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-text-secondary shadow-card backdrop-blur-sm">
            {portfolio.category_name}
          </span>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent">
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
          className="mt-1 h-4 w-4 shrink-0 text-text-subtle transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
          strokeWidth={1.8}
        />
      </div>
    </Link>
  );
}
