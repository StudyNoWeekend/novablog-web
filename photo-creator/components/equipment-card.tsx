import Image from "next/image";
import { Backpack } from "lucide-react";
import type { Equipment } from "@/lib/api";

/** 装备卡片：纯展示（图片/名称/品牌/描述），不链接详情 */
export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40 focus-within:ring-2 focus-within:ring-ring">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {equipment.image_url ? (
          <Image
            src={equipment.image_url}
            alt={equipment.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Backpack className="size-10" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-medium text-foreground">
          {equipment.name}
        </h3>
        {equipment.brand && (
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {equipment.brand}
          </p>
        )}
        {equipment.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {equipment.description}
          </p>
        )}
      </div>
    </article>
  );
}
