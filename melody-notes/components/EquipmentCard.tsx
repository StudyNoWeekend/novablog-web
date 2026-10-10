"use client";

import Image from "next/image";
import { Backpack } from "lucide-react";
import { getFileUrl } from "@/lib/api/client";
import type { Equipment } from "@/lib/types";

interface EquipmentCardProps {
  equipment: Equipment;
}

/** 装备卡片：图片 + 名称 + 品牌 + 描述（纯展示，不链接详情） */
export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover">
      {/* 图片 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        {equipment.image_url ? (
          <Image
            src={getFileUrl(equipment.image_url)}
            alt={equipment.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(100%_120%_at_50%_0%,#1d2f26_0%,#16211c_70%)]">
            <Backpack className="h-9 w-9 text-accent/40" strokeWidth={1.2} />
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 text-[17px] font-bold leading-snug text-text-primary">
            {equipment.name}
          </h3>
          {equipment.brand && (
            <span className="shrink-0 rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent">
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
