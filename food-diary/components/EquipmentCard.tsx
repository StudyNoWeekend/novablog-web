"use client";

import Image from "next/image";
import { Backpack } from "lucide-react";
import type { Equipment } from "@/lib/types";

interface EquipmentCardProps {
  equipment: Equipment;
}

/** 装备展示卡片：图片 + 名称 + 品牌 + 描述（纯展示，不链接详情页） */
export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      {/* 图片 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-background-soft">
        {equipment.image_url ? (
          <Image
            src={equipment.image_url}
            alt={equipment.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-subtle">
            <Backpack className="h-10 w-10" strokeWidth={1.2} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate font-display text-lg leading-snug text-text-primary">
            {equipment.name}
          </h3>
          {equipment.brand && (
            <span className="shrink-0 rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent-hover">
              {equipment.brand}
            </span>
          )}
        </div>
        {equipment.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
            {equipment.description}
          </p>
        )}
      </div>
    </article>
  );
}
