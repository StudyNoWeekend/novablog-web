import { apiFetch } from "./client";
import type { Paginated, Video } from "@/lib/types";

export interface GetVideosParams {
  page?: number;
  page_size?: number;
  keyword?: string;
}

export async function getVideos(
  params: GetVideosParams = {}
): Promise<Paginated<Video>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);

  const qs = query.toString();
  const path = qs ? `/public/videos?${qs}` : "/public/videos";

  try {
    return await apiFetch<Paginated<Video>>(path);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}
