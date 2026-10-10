import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, Heart, MapPin, Star } from "lucide-react";
import type { TravelGuide } from "@/lib/types";

/** 数字缩写：>=1万 显示 x.x万，>=1000 显示 x.xk */
function formatCount(n: number): string {
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}万`;
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  return String(n);
}

interface TravelCardProps {
  travel: TravelGuide;
}

/** 旅行攻略卡片：封面 + 目的地徽章 + 标题摘要 + 天数/评分/浏览/点赞 */
export function TravelCard({ travel }: TravelCardProps) {
  return (
    <Link
      href={`/travels/${travel.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-background-soft">
        {travel.cover_image ? (
          <Image
            src={travel.cover_image}
            alt={travel.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-subtle">
            <MapPin className="h-10 w-10" strokeWidth={1} />
          </div>
        )}
        {travel.destination && (
          <span className="absolute left-3 top-3 inline-flex max-w-[80%] items-center gap-1 truncate rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
            <MapPin className="h-3 w-3 shrink-0 text-accent" strokeWidth={2} />
            <span className="truncate">{travel.destination}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1.5 line-clamp-2 font-heading text-base leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
          {travel.title}
        </h3>
        {travel.summary && (
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-text-muted">
            {travel.summary}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border pt-3 text-xs text-text-subtle">
          {travel.days > 0 && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
              {travel.days} 天
            </span>
          )}
          {travel.rating > 0 && (
            <span className="flex items-center gap-1 text-accent">
              <Star className="h-3.5 w-3.5 fill-accent" strokeWidth={0} />
              {travel.rating.toFixed(1)}
            </span>
          )}
          <span className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
              {formatCount(travel.view_count)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
              {formatCount(travel.like_count)}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
