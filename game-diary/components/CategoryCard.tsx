import Link from "next/link";
import {
  Crosshair,
  Crown,
  Gamepad2,
  Ghost,
  Puzzle,
  Rocket,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";
import type { Category } from "@/lib/types";

const ICONS = [
  Rocket,
  Swords,
  Crosshair,
  Ghost,
  Trophy,
  Crown,
  Puzzle,
  Sparkles,
  Gamepad2,
];

// 霓虹渐变色板：紫 / 品红 / 蓝 / 青紫循环
const GRADIENTS = [
  "from-violet-600 to-fuchsia-600",
  "from-indigo-500 to-violet-600",
  "from-fuchsia-600 to-rose-500",
  "from-violet-500 to-indigo-600",
  "from-purple-600 to-fuchsia-500",
  "from-blue-500 to-violet-600",
];

interface CategoryCardProps {
  category: Category;
  index: number;
  articleCount?: number;
}

export function CategoryCard({ category, index, articleCount }: CategoryCardProps) {
  const Icon = ICONS[index % ICONS.length];
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <Link
      href={`/articles?category_id=${encodeURIComponent(category.id)}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
      aria-label={`查看「${category.name}」分类下的文章`}
    >
      <div
        className={`relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br ${gradient}`}
      >
        {/* 纹理装饰 */}
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white_1px,transparent_1px)] [background-size:14px_14px]" />
        <Icon
          className="h-10 w-10 text-white/90 transition-transform duration-300 ease-out group-hover:scale-110"
          strokeWidth={1.6}
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
          {category.name}
        </h3>
        <p className="mt-1 text-xs text-text-subtle">
          {typeof articleCount === "number"
            ? `${articleCount} 篇内容`
            : category.description
              ? category.description
              : "游戏相关内容"}
        </p>
      </div>
    </Link>
  );
}
