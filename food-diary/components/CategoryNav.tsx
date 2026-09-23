"use client";

import Link from "next/link";
import {
  CakeSlice,
  CupSoda,
  Plane,
  Soup,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";
import type { Category } from "@/lib/types";

interface CategoryNavProps {
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
  { icon: Soup, bg: "#fceedd", color: "#d9822b" },
  { icon: CakeSlice, bg: "#fbe4e2", color: "#d96a63" },
  { icon: Wheat, bg: "#f3ecdc", color: "#a9853f" },
  { icon: UtensilsCrossed, bg: "#e8f1e3", color: "#6f9c50" },
  { icon: CupSoda, bg: "#e3eef8", color: "#4d7fb2" },
];

/** 热门分类条：前 5 个文章分类 + 固定的「旅行美食」磁贴（对应 UI 图第六格） */
export function CategoryNav({ categories, travelEnabled }: CategoryNavProps) {
  const tiles: {
    key: string;
    label: string;
    href: string;
    style: TileStyle;
  }[] = categories.slice(0, 5).map((category, index) => ({
    key: category.id,
    label: category.name,
    href: `/articles?category_id=${encodeURIComponent(category.id)}`,
    style: TILE_STYLES[index % TILE_STYLES.length],
  }));

  if (travelEnabled) {
    tiles.push({
      key: "travel-food",
      label: "旅行美食",
      href: "/travels",
      style: { icon: Plane, bg: "#efe8f8", color: "#8663b5" },
    });
  }

  if (tiles.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-border bg-surface py-10 md:py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-12 lg:px-8">
        {/* 手写标签 + 手绘箭头 */}
        <div className="relative shrink-0 select-none text-center lg:-rotate-3 lg:pt-2">
          <p className="font-display text-2xl text-text-primary">热门分类</p>
          <svg
            aria-hidden="true"
            viewBox="0 0 48 40"
            className="mx-auto mt-1 h-8 w-10 text-accent"
            fill="none"
          >
            <path
              d="M6 4 C 14 22, 26 30, 40 32 M 40 32 l -8 -1 M 40 32 l -4 -7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 分类磁贴 */}
        <div className="flex flex-1 flex-wrap items-start justify-center gap-x-8 gap-y-6 md:gap-x-14">
          {tiles.map((tile) => {
            const Icon = tile.style.icon;
            return (
              <Link
                key={tile.key}
                href={tile.href}
                className="group flex w-20 cursor-pointer flex-col items-center gap-2.5 sm:w-24"
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-card sm:h-18 sm:w-18"
                  style={{ backgroundColor: tile.style.bg }}
                >
                  <Icon
                    className="h-7 w-7 transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8"
                    style={{ color: tile.style.color }}
                    strokeWidth={1.6}
                  />
                </span>
                <span className="text-center">
                  <span className="block text-sm font-medium text-text-secondary transition-colors duration-200 group-hover:text-accent-hover">
                    {tile.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
