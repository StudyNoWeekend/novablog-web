"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, Heart, MapPin, Star } from "lucide-react";
import { getFileUrl } from "@/lib/api/client";
import type { TravelGuide } from "@/lib/types";

interface TravelCardProps {
  travel: TravelGuide;
}

/** 旅行攻略卡片：封面 / 标题 / 目的地 / 天数 / 评分 */
export function TravelCard({ travel }: TravelCardProps) {
  return (
    <Link
      href={`/travels/${travel.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      {/* 封面 */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        {travel.cover_image ? (
          <Image
            src={getFileUrl(travel.cover_image)}
            alt={travel.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(100%_120%_at_50%_0%,#1d2f26_0%,#16211c_70%)]">
            <MapPin className="h-9 w-9 text-accent/40" strokeWidth={1.2} />
          </div>
        )}
        {travel.destination && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-text-secondary shadow-card backdrop-blur-sm">
            <MapPin className="h-3 w-3 text-accent" strokeWidth={2} />
            {travel.destination}
          </span>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-[17px] font-bold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent">
          {travel.title}
        </h3>
        {travel.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
            {travel.summary}
          </p>
        )}
        <div className="mt-4 flex flex-1 flex-wrap content-end items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-text-subtle">
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
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
            {travel.view_count}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" strokeWidth={1.6} />
            {travel.like_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
