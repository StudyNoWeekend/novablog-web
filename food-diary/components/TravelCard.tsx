"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, Heart, MapPin, Star } from "lucide-react";
import type { TravelGuide } from "@/lib/types";

interface TravelCardProps {
  travel: TravelGuide;
}

export function TravelCard({ travel }: TravelCardProps) {
  return (
    <Link
      href={`/travels/${travel.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-background-soft">
        {travel.cover_image ? (
          <Image
            src={travel.cover_image}
            alt={travel.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-hand text-3xl text-text-subtle">on the road!</span>
          </div>
        )}
        {/* 目的地角标 */}
        {travel.destination && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-cocoa/85 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <MapPin className="h-3 w-3" strokeWidth={1.8} />
            {travel.destination}
          </span>
        )}
        {travel.rating > 0 && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-surface/90 px-2 py-1 text-[11px] font-medium text-accent-hover shadow-card backdrop-blur-sm">
            <Star className="h-3 w-3 fill-accent text-accent" strokeWidth={1.5} />
            {travel.rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
          {travel.title}
        </h3>
        {travel.summary && (
          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
            {travel.summary}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-text-subtle">
          {travel.days > 0 && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
              {travel.days} 天
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
            {travel.view_count}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
            {travel.like_count}
          </span>
          {travel.best_month && <span>最佳月份 {travel.best_month}</span>}
        </div>
      </div>
    </Link>
  );
}
