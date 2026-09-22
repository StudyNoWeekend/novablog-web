"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, MapPin, Star } from "lucide-react";
import { getTravels } from "@/lib/api/travels";
import type { TravelGuide } from "@/lib/types";

interface DestinationGroup {
  name: string;
  guides: TravelGuide[];
}

/**
 * 目的地页：拉取全部已发布攻略，按目的地聚合展示；点击进入按关键词筛选的攻略列表。
 */
export function DestinationsContent() {
  const [travels, setTravels] = useState<TravelGuide[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTravels({ page: 1, page_size: 100 }).then((data) => {
      if (cancelled) return;
      setTravels(data.list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = travels === null;
  const groups = useMemo<DestinationGroup[]>(() => {
    const map = new Map<string, TravelGuide[]>();
    (travels ?? []).forEach((travel) => {
      const name = travel.destination || travel.region || "未知目的地";
      const list = map.get(name) ?? [];
      list.push(travel);
      map.set(name, list);
    });
    return Array.from(map.entries())
      .map(([name, guides]) => ({ name, guides }))
      .sort((a, b) => b.guides.length - a.guides.length);
  }, [travels]);

  if (loading) {
    return (
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[16/10] animate-pulse rounded-radius-lg bg-surface"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }  if (groups.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle">
          <Compass className="h-7 w-7 text-accent" strokeWidth={1.5} />
        </div>
        <p className="mt-6 font-display text-xl text-text-secondary">
          目的地正在策划中，敬请期待
        </p>
        <Link
          href="/travels"
          className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
        >
          先看看攻略
        </Link>
      </div>
    );
  }

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const cover = group.guides.find((g) => g.cover_image)?.cover_image;
            const rating = group.guides.some((g) => g.rating > 0)
              ? Math.max(...group.guides.map((g) => g.rating))
              : 0;
            return (
              <Link
                key={group.name}
                href={`/travels?keyword=${encodeURIComponent(group.name)}`}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-lg bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-background-soft">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={group.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#dcebdf,#c2d9c9)]">
                      <MapPin className="h-9 w-9 text-accent/60" strokeWidth={1.5} />
                    </div>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm">
                    {group.guides.length} 篇攻略
                  </span>
                </div>

                <div className="flex flex-1 items-center justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <h2 className="flex items-center gap-1.5 font-display text-lg text-text-primary transition-colors duration-200 group-hover:text-accent">
                      <MapPin className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.8} />
                      <span className="truncate">{group.name}</span>
                    </h2>
                    {rating > 0 && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-text-muted">
                        <Star className="h-3.5 w-3.5 fill-flame text-flame" strokeWidth={0} />
                        最高评分 {rating.toFixed(1)}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-text-subtle transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
                    strokeWidth={1.8}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
