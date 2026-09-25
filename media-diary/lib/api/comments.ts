import { apiFetch } from "./client";
import type { Comment, CreateCommentPayload, Paginated } from "@/lib/types";

export interface ListCommentsParams {
  target_type?: string;
  target_id?: string;
  page?: number;
  page_size?: number;
}

export async function listComments(
  params: ListCommentsParams = {}
): Promise<Paginated<Comment>> {
  const query = new URLSearchParams();
  if (params.target_type) query.set("target_type", params.target_type);
  if (params.target_id) query.set("target_id", params.target_id);
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));

  const qs = query.toString();
  const path = qs ? `/public/comments?${qs}` : "/public/comments";

  try {
    return await apiFetch<Paginated<Comment>>(path);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}

export async function createComment(
  payload: CreateCommentPayload
): Promise<Comment> {
  const data = await apiFetch<Comment>("/public/comments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}
