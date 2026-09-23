import { apiFetch } from "./client";
import type { Comment, CreateCommentPayload, Paginated } from "@/lib/types";

export async function listComments(params: {
  target_type: string;
  target_id: string;
  page?: number;
  page_size?: number;
}): Promise<Paginated<Comment>> {
  const query = new URLSearchParams();
  query.set("target_type", params.target_type);
  query.set("target_id", params.target_id);
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));

  try {
    return await apiFetch<Paginated<Comment>>(`/public/comments?${query.toString()}`);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}

/**
 * 发表评论。失败时抛出错误，由调用方展示错误反馈。
 */
export async function createComment(
  payload: CreateCommentPayload
): Promise<Comment> {
  return apiFetch<Comment>("/public/comments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
