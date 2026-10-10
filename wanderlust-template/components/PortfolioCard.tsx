import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Images } from "lucide-react";
import type { Portfolio } from "@/lib/types";

/** 作品集卡片：封面 + 名称 + 分类 + 作品数 */
export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Link
      href={`/portfolio/${portfolio.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-lg bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
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
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#eef3ec,#dfe8e0)]">
            <Images className="h-9 w-9 text-accent/50" strokeWidth={1.5} />
          </div>
        )}
        {portfolio.category_name && (
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm">
            {portfolio.category_name}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-text-primary transition-colors duration-200 group-hover:text-accent">
            {portfolio.name}
          </h2>
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
