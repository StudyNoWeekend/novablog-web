import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Eye, Heart, MapPin, Star } from "lucide-react";
import type { TravelGuide } from "@/lib/api";

/** 旅行攻略卡片：封面 + 目的地角标 + 标题 + 摘要 + 天数/评分/浏览/点赞 */
export function TravelCard({ travel }: { travel: TravelGuide }) {
  return (
    <Link
      href={`/travels/${travel.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40 focus-within:ring-2 focus-within:ring-ring cursor-pointer"
      aria-label={travel.title}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {travel.cover_image ? (
          <Image
            src={travel.cover_image}
            alt={travel.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <MapPin className="size-10" aria-hidden="true" />
          </div>
        )}
        {travel.destination && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            <MapPin className="size-3 text-primary" aria-hidden="true" />
            {travel.destination}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-medium text-foreground transition-colors group-hover:text-primary">
          {travel.title}
        </h3>
        {travel.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {travel.summary}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          {travel.days > 0 && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {travel.days} 天
            </span>
          )}
          {travel.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
              {travel.rating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" aria-hidden="true" />
            {travel.view_count}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="size-3.5" aria-hidden="true" />
            {travel.like_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
