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
  icon: LucideIcon;
  /** 与 module-config 模块开关联动，关闭的模块导航项自动隐藏 */
  moduleKey?: keyof ModuleConfig;
}

/**
 * 全量内容模块清单（CMS /public/module-config 的 12 个内容模块），顺序即导航顺序。
 * 桌面端平铺前 10 项（按 01-10 重新编号），其余收纳进「更多」下拉（带 icon 不带编号）；
 * 移动端菜单与页脚全量展示。显隐一律由模块开关控制。
 */
export const NAV_MODULES: NavModule[] = [
  { label: "故事", href: "/portfolios", icon: Camera, moduleKey: "portfolio_enabled" },
  { label: "音乐", href: "/music", icon: Music, moduleKey: "music_enabled" },
  { label: "日志", href: "/articles", icon: NotebookPen, moduleKey: "article_enabled" },
  { label: "旅行", href: "/travels", icon: Map, moduleKey: "travel_enabled" },
  { label: "视频", href: "/videos", icon: Clapperboard, moduleKey: "video_enabled" },
  { label: "装备", href: "/gear", icon: Backpack, moduleKey: "equipment_enabled" },
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

/** 编号视觉：平铺项按位置生成 01、02… 编号（不落库，随过滤结果重排） */
export function moduleNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
