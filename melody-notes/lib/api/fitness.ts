import { apiFetch } from "./client";
import type { FitnessRecord, ListResult } from "@/lib/types";

export interface GetFitnessParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  type?: "strength" | "cardio" | "stretch"; // all 时不传
}

/** 健身训练记录列表（仅列表，无详情接口） */
export async function getFitnessRecords(
  params: GetFitnessParams = {}
): Promise<ListResult<FitnessRecord>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.type) query.set("type", params.type);

  const qs = query.toString();
  const path = qs ? `/public/fitness?${qs}` : "/public/fitness";

  try {
    return await apiFetch<ListResult<FitnessRecord>>(path);
  } catch (error) {
    console.error("Failed to fetch fitness records:", error);
    // failed 标记供列表页区分「加载失败」与「暂无内容」
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0, failed: true };
  }
}
