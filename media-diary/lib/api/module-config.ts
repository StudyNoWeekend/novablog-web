import { cache } from "react";
import { apiFetch } from "./client";
import type { ModuleConfig } from "@/lib/types";

const ALL_ENABLED: ModuleConfig = {
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
 * 获取模块开关配置。同一请求内去重；失败时回退为全部开启，保证页面可用。
 */
export const getModuleConfig = cache(async (): Promise<ModuleConfig> => {
  try {
    const config = await apiFetch<ModuleConfig>("/public/module-config");
    return { ...ALL_ENABLED, ...config };
  } catch (error) {
    console.error("Failed to fetch module config:", error);
    return ALL_ENABLED;
  }
});
