import {
  BookOpen,
  ChefHat,
  Dumbbell,
  Gamepad2,
  Github,
  Layers,
  type LucideIcon,
} from "lucide-react";
import type { ModuleConfig } from "@/lib/types";

export interface MoreNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  moduleKey: keyof ModuleConfig;
}

/** 「更多」下拉 / 移动端「更多功能」小节 / 页脚链接共用的六个新模块入口 */
export const MORE_NAV_ITEMS: MoreNavItem[] = [
  { label: "开源作品", href: "/open-source", icon: Github, moduleKey: "open_source_enabled" },
  { label: "菜谱分享", href: "/recipes", icon: ChefHat, moduleKey: "recipe_enabled" },
  { label: "读书书架", href: "/books", icon: BookOpen, moduleKey: "book_enabled" },
  { label: "游戏库", href: "/games", icon: Gamepad2, moduleKey: "game_enabled" },
  { label: "健身训练", href: "/fitness", icon: Dumbbell, moduleKey: "fitness_enabled" },
  { label: "技术栈", href: "/tech-stack", icon: Layers, moduleKey: "tech_stack_enabled" },
];

/** 按模块开关过滤「更多」入口；modules 为空（配置未取到）时全量返回 */
export function filterMoreItems(modules?: ModuleConfig | null): MoreNavItem[] {
  if (!modules) return MORE_NAV_ITEMS;
  return MORE_NAV_ITEMS.filter((item) => modules[item.moduleKey]);
}
