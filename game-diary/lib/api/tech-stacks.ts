import { apiFetch } from "./client";
import type { ListResult, TechStack } from "@/lib/types";

export interface GetTechStacksParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  category?: string;
  level?: number; // 1=了解 2=熟悉 3=熟练 4=精通
}

/** 技术栈列表（仅列表，无详情接口） */
export async function getTechStacks(
  params: GetTechStacksParams = {}
): Promise<ListResult<TechStack>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.category) query.set("category", params.category);
  if (params.level) query.set("level", String(params.level));

  const qs = query.toString();
  const path = qs ? `/public/tech-stacks?${qs}` : "/public/tech-stacks";

  try {
    return await apiFetch<ListResult<TechStack>>(path);
  } catch (error) {
    console.error("Failed to fetch tech stacks:", error);
    // failed 标记供列表页区分「加载失败」与「暂无内容」
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0, failed: true };
  }
}
