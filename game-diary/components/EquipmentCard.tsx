import Image from "next/image";
import { Backpack } from "lucide-react";
import type { Equipment } from "@/lib/types";

/** 装备卡片（纯展示，无详情页，不链接） */
export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card">
      {/* 图片 */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
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
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-elevated to-background-soft">
            <Backpack className="h-9 w-9 text-accent/50" strokeWidth={1.5} />
          </div>
        )}
        {equipment.brand && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {equipment.brand}
          </span>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-heading text-base font-bold leading-snug text-text-primary">
          {equipment.name}
        </h2>
        {equipment.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
            {equipment.description}
          </p>
        )}
      </div>
    </article>
  );
}
