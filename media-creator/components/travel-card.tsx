import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, Heart, MapPin, Star } from "lucide-react";
import type { TravelGuide } from "@/lib/api";

interface TravelCardProps {
  travel: TravelGuide;
  priority?: boolean;
}

/** 旅行攻略卡片：封面 + 目的地角标 + 标题/摘要 + 天数/评分/浏览/点赞 */
export function TravelCard({ travel, priority }: TravelCardProps) {
  return (
    <Link
      href={`/travels/${travel.id}`}
      className="group card-lift flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {travel.cover_image ? (
          <Image
            src={travel.cover_image}
            alt={travel.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <MapPin className="h-10 w-10 text-muted-foreground/60" />
          </div>
        )}
        {travel.destination && (
          <span className="absolute left-3 top-3 inline-flex max-w-[80%] items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
            <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
            <span className="truncate">{travel.destination}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {travel.title}
        </h3>
        {travel.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {travel.summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          {travel.days > 0 && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {travel.days} 天
            </span>
          )}
          {travel.rating > 0 && (
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              {travel.rating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            {travel.view_count}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            {travel.like_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
