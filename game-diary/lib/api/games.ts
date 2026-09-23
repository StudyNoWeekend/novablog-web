import { apiFetch } from "./client";
import type { GameEntry, Paginated } from "@/lib/types";

export interface GetGamesParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  brand?: string;
}

export async function getGames(
  params: GetGamesParams = {}
): Promise<Paginated<GameEntry>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.brand) query.set("brand", params.brand);

  const qs = query.toString();
  const path = qs ? `/public/equipments?${qs}` : "/public/equipments";

  try {
    return await apiFetch<Paginated<GameEntry>>(path);
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}

export async function getGameById(id: string): Promise<GameEntry | null> {
  try {
    return await apiFetch<GameEntry>(`/public/equipments/${id}`);
  } catch (error) {
    console.error("Failed to fetch game detail:", error);
    return null;
  }
}
