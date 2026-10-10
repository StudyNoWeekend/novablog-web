import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, Heart, MapPin, Star } from "lucide-react";
import { getFileUrl } from "@/lib/api/client";
import type { TravelGuide } from "@/lib/types";

interface TravelCardProps {
  travel: TravelGuide;
}

/** 旅行攻略卡片：封面 + 目的地徽标 + 标题/摘要 + 天数/评分/浏览/点赞 */
export function TravelCard({ travel }: TravelCardProps) {
  return (
    <Link
      href={`/travels/${travel.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* 封面 */}
      <div className="relative aspect-[16/10] overflow-hidden bg-background-soft">
        {travel.cover_image ? (
          <Image
            src={getFileUrl(travel.cover_image)}
            alt={travel.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <MapPin className="h-10 w-10 text-text-subtle" strokeWidth={1} />
          </div>
        )}
        {travel.destination && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-accent backdrop-blur-sm">
            {travel.destination}
          </span>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-lg leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
          {travel.title}
        </h3>
        {travel.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
            {travel.summary}
          </p>
        )}

        {/* 天数 / 评分 / 浏览 / 点赞 */}
        <div className="mt-4 flex flex-1 flex-wrap content-end items-center gap-x-4 gap-y-1.5 border-t border-dashed border-border-strong pt-3 text-xs text-text-muted">
          {travel.days > 0 && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-text-subtle" strokeWidth={1.5} />
              {travel.days} 天
            </span>
          )}
          {travel.rating > 0 && (
            <span className="flex items-center gap-1 text-tomato">
              <Star className="h-3.5 w-3.5 fill-tomato" strokeWidth={0} />
              {travel.rating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-text-subtle" strokeWidth={1.5} />
            {travel.view_count}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-tomato/70" strokeWidth={1.6} />
            {travel.like_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
