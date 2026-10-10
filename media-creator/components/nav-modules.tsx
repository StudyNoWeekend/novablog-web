import {
  Backpack,
  BookOpen,
  Camera,
  ChefHat,
  Clapperboard,
  Dumbbell,
  Gamepad2,
  GitFork,
  Layers,
  Map,
  Music,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";
import type { ModuleConfig } from "@/lib/api";

export interface NavModule {
  label: string;
  href: string;
  /** 「更多」下拉与移动端菜单展示的图标（平铺文字项与尾部固定项可不带） */
  icon?: LucideIcon;
  moduleKey?: keyof ModuleConfig;
}

/**
 * 全量内容模块清单（CMS 公开模块），按主题导航顺序排列。
 * 桌面端平铺前 10 项，其余收纳进「更多」下拉；移动端菜单与页脚全量展示。
 * 显隐一律由 /public/module-config 的模块开关控制。
 */
export const NAV_MODULES: NavModule[] = [
  { label: "作品", href: "/videos", icon: Clapperboard, moduleKey: "video_enabled" },
  { label: "音乐", href: "/music", icon: Music, moduleKey: "music_enabled" },
  { label: "博客", href: "/articles", icon: NotebookPen, moduleKey: "article_enabled" },
  { label: "设备", href: "/gear", icon: Backpack, moduleKey: "equipment_enabled" },
  { label: "旅行", href: "/travels", icon: Map, moduleKey: "travel_enabled" },
  { label: "作品集", href: "/portfolio", icon: Camera, moduleKey: "portfolio_enabled" },
  { label: "开源作品", href: "/open-source", icon: GitFork, moduleKey: "open_source_enabled" },
  { label: "美食菜谱", href: "/recipes", icon: ChefHat, moduleKey: "recipe_enabled" },
  { label: "读书书架", href: "/books", icon: BookOpen, moduleKey: "book_enabled" },
  { label: "游戏库", href: "/games", icon: Gamepad2, moduleKey: "game_enabled" },
  { label: "健身训练", href: "/fitness", icon: Dumbbell, moduleKey: "fitness_enabled" },
  { label: "技术栈", href: "/tech-stack", icon: Layers, moduleKey: "tech_stack_enabled" },
];

/** 按模块开关过滤全量清单；modules 为空（配置未取到）时全量返回 */
export function filterNavModules(modules?: ModuleConfig | null): NavModule[] {
  if (!modules) return NAV_MODULES;
  return NAV_MODULES.filter((item) => !item.moduleKey || modules[item.moduleKey]);
}

/** 桌面端导航拆分：前 10 项平铺，其余收纳进「更多」下拉 */
export function splitNavModules(modules?: ModuleConfig | null): {
  mainItems: NavModule[];
  moreItems: NavModule[];
} {
  const items = filterNavModules(modules);
  return { mainItems: items.slice(0, 10), moreItems: items.slice(10) };
}
