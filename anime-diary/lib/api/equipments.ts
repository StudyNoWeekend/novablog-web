import { apiFetch } from "./client";
import type { Equipment, ListResult } from "@/lib/types";

export interface GetEquipmentsParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  brand?: string;
}

/** 装备列表（纯展示，无详情页；failed 标记供错误重试态使用） */
export async function getEquipments(
  params: GetEquipmentsParams = {}
): Promise<ListResult<Equipment>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.brand) query.set("brand", params.brand);

  const qs = query.toString();
  const path = qs ? `/public/equipments?${qs}` : "/public/equipments";

  try {
    return await apiFetch<ListResult<Equipment>>(path);
  } catch (error) {
    console.error("Failed to fetch equipments:", error);
    // failed 标记供列表页区分「加载失败」与「暂无内容」
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0, failed: true };
  }
}
