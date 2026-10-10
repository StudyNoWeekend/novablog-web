import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Images } from "lucide-react";
import type { Portfolio } from "@/lib/api";

interface PortfolioCardProps {
  portfolio: Portfolio;
  priority?: boolean;
}

/** 作品集卡片：封面 + 分类角标 + 名称/简介 + 作品数 */
export function PortfolioCard({ portfolio, priority }: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolio/${portfolio.id}`}
      className="group card-lift flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {portfolio.cover_url ? (
          <Image
            src={portfolio.cover_url}
            alt={portfolio.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Images className="h-10 w-10 text-muted-foreground/60" />
          </div>
        )}
        {portfolio.category_name && (
          <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
            {portfolio.category_name}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {portfolio.name}
          </h3>
          {portfolio.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {portfolio.description}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {portfolio.item_count} 个作品
          </p>
        </div>
        <ChevronRight
          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
