import { apiFetch } from "./client";
import type { ListResult, OpenSource, OpenSourceDetail } from "@/lib/types";

export interface GetOpenSourcesParams {
  page?: number;
  page_size?: number;
  keyword?: string;
}

/** 开源作品列表 */
export async function getOpenSources(
  params: GetOpenSourcesParams = {}
): Promise<ListResult<OpenSource>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);

  const qs = query.toString();
  const path = qs ? `/public/open-sources?${qs}` : "/public/open-sources";

  try {
    return await apiFetch<ListResult<OpenSource>>(path);
  } catch (error) {
    console.error("Failed to fetch open sources:", error);
    // failed 标记供列表页区分「加载失败」与「暂无内容」
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0, failed: true };
  }
}

/** 开源作品详情（含 Markdown readme） */
export async function getOpenSourceById(id: string): Promise<OpenSourceDetail | null> {
  try {
    return await apiFetch<OpenSourceDetail>(`/public/open-sources/${id}`);
  } catch (error) {
    console.error("Failed to fetch open source detail:", error);
    return null;
  }
}
