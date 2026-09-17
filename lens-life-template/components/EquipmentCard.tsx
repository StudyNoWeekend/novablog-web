import Image from "next/image";
import { Camera } from "lucide-react";
import type { Equipment } from "@/lib/types";

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-radius-md bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover hover:ring-1 hover:ring-accent/30">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-background-soft">
        {equipment.image_url ? (
          <Image
            src={equipment.image_url}
            alt={equipment.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Camera className="h-8 w-8 text-text-subtle" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {equipment.brand && (
          <span className="mb-2 self-start rounded-full border border-border bg-background-soft px-2.5 py-1 text-xs font-medium text-accent">
            {equipment.brand}
          </span>
        )}
        <h3 className="font-[var(--font-playfair)] text-lg font-medium text-text-primary">
          {equipment.name}
        </h3>
        {equipment.description && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-text-muted">
            {equipment.description}
          </p>
        )}
      </div>
    </article>
  );
}
