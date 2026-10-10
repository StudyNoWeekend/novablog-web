import {
  Backpack,
  BookOpen,
  Camera,
  ChefHat,
  Clapperboard,
  Dumbbell,
  Gamepad2,
  Github,
  Layers,
  Map,
  Music,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";
import type { ModuleConfig } from "@/lib/types";

export interface NavModule {
  label: string;
  href: string;
  icon: LucideIcon;
  moduleKey?: keyof ModuleConfig;
}

/** 全站统一默认开关：构建期兜底值 + 客户端运行时合并基线 */
export const ALL_MODULE_CONFIG: ModuleConfig = {
  article_enabled: true,
  media_enabled: true,
  music_enabled: true,
  video_enabled: true,
  travel_enabled: true,
  portfolio_enabled: true,
  equipment_enabled: true,
  open_source_enabled: true,
  recipe_enabled: true,
  book_enabled: true,
  game_enabled: true,
  fitness_enabled: true,
  tech_stack_enabled: true,
  updated_at: "",
};

/**
 * 全量内容模块清单（CMS 公开模块），按主题导航顺序排列。
 * 本主题的视频模块页面为既有 /works（作品展示），不新建 /videos。
 * 桌面端平铺前 10 项，其余收纳进「更多」下拉；移动端菜单与页脚全量展示。
 * 显隐一律由 /public/module-config 的模块开关控制。
 */
export const NAV_MODULES: NavModule[] = [
  { label: "作品展示", href: "/works", icon: Clapperboard, moduleKey: "video_enabled" },
  { label: "内容专栏", href: "/articles", icon: NotebookPen, moduleKey: "article_enabled" },
  { label: "音乐", href: "/music", icon: Music, moduleKey: "music_enabled" },
  { label: "旅行", href: "/travels", icon: Map, moduleKey: "travel_enabled" },
  { label: "作品集", href: "/portfolio", icon: Camera, moduleKey: "portfolio_enabled" },
  { label: "装备", href: "/gear", icon: Backpack, moduleKey: "equipment_enabled" },
  { label: "开源作品", href: "/open-source", icon: Github, moduleKey: "open_source_enabled" },
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
