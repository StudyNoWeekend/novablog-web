import { apiFetch } from "./client";
import type { Game, GameDetail, ListResult } from "@/lib/types";

export interface GetGamesParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  platform?: string;
  genre?: string;
  play_status?: "want" | "playing" | "played"; // all 时不传
}

/** 游戏库列表（真实游戏接口：标题/封面/平台/类型/游玩状态/评分） */
export async function getGames(
  params: GetGamesParams = {}
): Promise<ListResult<Game>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.platform) query.set("platform", params.platform);
  if (params.genre) query.set("genre", params.genre);
  if (params.play_status) query.set("play_status", params.play_status);

  const qs = query.toString();
  const path = qs ? `/public/games?${qs}` : "/public/games";

  try {
    return await apiFetch<ListResult<Game>>(path);
  } catch (error) {
    console.error("Failed to fetch games:", error);
    // failed 标记供列表页区分「加载失败」与「暂无内容」
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0, failed: true };
  }
}

/** 游戏详情（含短评） */
export async function getGameById(id: string): Promise<GameDetail | null> {
  try {
    return await apiFetch<GameDetail>(`/public/games/${id}`);
  } catch (error) {
    console.error("Failed to fetch game detail:", error);
    return null;
  }
}
