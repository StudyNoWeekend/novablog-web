"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { Portfolio } from "@/lib/api";

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolios/${portfolio.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border/80 hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {portfolio.cover_url ? (
          <Image
            src={portfolio.cover_url}
            alt={portfolio.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
        {portfolio.item_count > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            {portfolio.item_count} 张
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-medium text-foreground transition-colors group-hover:text-primary">
          {portfolio.name}
        </h3>
        {portfolio.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {portfolio.description}
          </p>
        )}
      </div>
    </Link>
  );
}
