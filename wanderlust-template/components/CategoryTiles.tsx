"use client";

import Link from "next/link";
import { Backpack, Camera, Globe, Mountain, UtensilsCrossed } from "lucide-react";
import type { Category } from "@/lib/types";

interface CategoryTilesProps {
  categories: Category[];
  travelEnabled: boolean;
}

interface TileStyle {
  icon: React.ElementType;
  bg: string;
  color: string;
}

/** 与 UI 图一致的粉彩磁贴配色（依次循环） */
const TILE_STYLES: TileStyle[] = [
  { icon: Mountain, bg: "#e1f1e6", color: "#3e7c59" },
  { icon: Globe, bg: "#e1ecf8", color: "#3b6ea8" },
  { icon: Camera, bg: "#fceedd", color: "#d97c2b" },
  { icon: UtensilsCrossed, bg: "#f3e7f9", color: "#9558ad" },
  { icon: Backpack, bg: "#e7e9fb", color: "#4f5aa8" },
];

export function CategoryTiles({ categories, travelEnabled }: CategoryTilesProps) {
  // 前 4 个文章分类 + 固定的「旅行攻略」磁贴（对应 UI 图第五格）
  const tiles: {
    key: string;
    label: string;
    href: string;
    style: TileStyle;
  }[] = categories.slice(0, 4).map((category, index) => ({
    key: category.id,
    label: category.name,
    href: `/articles?category_id=${encodeURIComponent(category.id)}`,
    style: TILE_STYLES[index % TILE_STYLES.length],
  }));

  if (travelEnabled) {
    tiles.push({
      key: "travel-guides",
      label: "旅行攻略",
      href: "/travels",
      style: TILE_STYLES[4],
    });
  }

  if (tiles.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-6 md:gap-x-16">
          {tiles.map((tile) => {
            const Icon = tile.style.icon;
            return (
              <Link
                key={tile.key}
                href={tile.href}
                className="group flex cursor-pointer flex-col items-center gap-3"
              >
                <span
                  className="flex h-18 w-18 items-center justify-center rounded-2xl transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-card"
                  style={{ backgroundColor: tile.style.bg }}
                >
                  <Icon
                    className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: tile.style.color }}
                    strokeWidth={1.6}
                  />
                </span>
                <span className="text-sm text-text-secondary transition-colors duration-200 group-hover:text-accent">
                  {tile.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
