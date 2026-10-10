import { apiFetch } from "./client";
import type { ListResult, Video } from "@/lib/types";

export interface GetVideosParams {
  page?: number;
  page_size?: number;
  keyword?: string;
}

/** 视频作品列表（platforms[].url 为平台外链；failed 标记供错误重试态使用） */
export async function getVideos(
  params: GetVideosParams = {}
): Promise<ListResult<Video>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);

  const qs = query.toString();
  const path = qs ? `/public/videos?${qs}` : "/public/videos";

  try {
    return await apiFetch<ListResult<Video>>(path);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    // failed 标记供列表页区分「加载失败」与「暂无内容」
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0, failed: true };
  }
}
