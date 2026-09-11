import { apiFetch } from "./client";
import type { AudioUrl, Paginated, Song } from "@/lib/types";

export interface GetSongsParams {
  page?: number;
  page_size?: number;
  category_id?: string;
}

export async function getSongs(
  params: GetSongsParams = {}
): Promise<Paginated<Song>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.category_id) query.set("category_id", params.category_id);

  const qs = query.toString();
  const path = qs ? `/public/music/songs?${qs}` : "/public/music/songs";

  try {
    return await apiFetch<Paginated<Song>>(path);
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}

export async function getSongAudioUrl(songId: string): Promise<string | null> {
  try {
    const data = await apiFetch<AudioUrl>(`/public/music/audio-url/${songId}`);
    return data?.url ?? null;
  } catch (error) {
    console.error("Failed to fetch song audio url:", error);
    return null;
  }
}
