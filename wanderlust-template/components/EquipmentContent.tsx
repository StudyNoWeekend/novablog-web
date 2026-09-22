"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Backpack, ChevronRight } from "lucide-react";
import { getEquipments } from "@/lib/api/equipments";
import type { Equipment } from "@/lib/types";

export function EquipmentContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? undefined;

  const [equipments, setEquipments] = useState<Equipment[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getEquipments({ keyword, page: 1, page_size: 60 }).then((data) => {
      if (cancelled) return;
      setEquipments(data.list);
    });
    return () => {
      cancelled = true;
    };
  }, [keyword]);

  const loading = equipments === null;

  if (loading) {
    return (
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-radius-lg bg-surface"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (equipments.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle">
          <Backpack className="h-7 w-7 text-accent" strokeWidth={1.5} />
        </div>
        <p className="mt-6 font-display text-xl text-text-secondary">
          {keyword
            ? `未找到与「${keyword}」相关的装备`
            : "装备清单整理中，敬请期待"}
        </p>
        <Link
          href="/gear"
          className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
        >
          查看全部装备
        </Link>
      </div>
    );
  }

  return (
    <section className="flex-1 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipments.map((equipment) => (
            <Link
              key={equipment.id}
              href={`/gear/${equipment.id}`}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-lg bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-background-soft">
                {equipment.image_url ? (
                  <Image
                    src={equipment.image_url}
                    alt={equipment.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#eef3ec,#dfe8e0)]">
                    <Backpack className="h-9 w-9 text-accent/50" strokeWidth={1.5} />
                  </div>
                )}
                {equipment.brand && (
                  <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm">
                    {equipment.brand}
                  </span>
                )}
              </div>

              <div className="flex flex-1 items-start justify-between gap-3 p-5">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-text-primary transition-colors duration-200 group-hover:text-accent">
                    {equipment.name}
                  </h2>
                  {equipment.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
                      {equipment.description}
                    </p>
                  )}
                </div>
                <ChevronRight
                  className="mt-1 h-4 w-4 shrink-0 text-text-subtle transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
                  strokeWidth={1.8}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
