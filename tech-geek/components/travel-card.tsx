import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Eye, Heart, MapPin, Star } from "lucide-react";
import { TravelGuide } from "@/lib/api";

/** 旅行攻略卡片：封面 + 目的地 + 标题 + 摘要 + 数据元信息 */
export function TravelCard({ travel }: { travel: TravelGuide }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-ring">
      <Link
        href={`/travels/${travel.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
        aria-label={travel.title}
      >
        {travel.cover_image ? (
          <Image
            src={travel.cover_image}
            alt={travel.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900">
            <MapPin className="h-8 w-8 text-white/70" aria-hidden="true" />
          </div>
        )}
        {travel.destination && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {travel.destination}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold tracking-tight text-foreground">
          <Link
            href={`/travels/${travel.id}`}
            className="rounded transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {travel.title}
          </Link>
        </h3>
        {travel.summary && (
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {travel.summary}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {travel.days > 0 && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {travel.days} 天
            </span>
          )}
          {travel.rating > 0 && (
            <span className="flex items-center gap-1">
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
    </article>
  );
}
