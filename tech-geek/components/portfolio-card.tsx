import Link from "next/link";
import Image from "next/image";
import { Images } from "lucide-react";
import { Portfolio } from "@/lib/api";

/** 作品集卡片：封面 + 名称 + 简介 + 作品数量 */
export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-ring">
      <Link
        href={`/portfolio/${portfolio.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
        aria-label={portfolio.name}
      >
        {portfolio.cover_url ? (
          <Image
            src={portfolio.cover_url}
            alt={portfolio.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900">
            <Images className="h-8 w-8 text-white/70" aria-hidden="true" />
          </div>
        )}
        {portfolio.item_count > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <Images className="h-3 w-3" aria-hidden="true" />
            {portfolio.item_count} 张
          </span>
        )}
      </Link>

      <div className="p-4">
        <h3 className="font-semibold tracking-tight text-foreground">
          <Link
            href={`/portfolio/${portfolio.id}`}
            className="rounded transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {portfolio.name}
          </Link>
        </h3>
        {portfolio.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {portfolio.description}
          </p>
        )}
      </div>
    </article>
  );
}
