import { apiFetch } from "./client";
import type { Book, BookDetail, ListResult } from "@/lib/types";

export interface GetBooksParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  reading_status?: "want" | "reading" | "done"; // all 时不传
}

/** 读书书架列表 */
export async function getBooks(
  params: GetBooksParams = {}
): Promise<ListResult<Book>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.reading_status) query.set("reading_status", params.reading_status);

  const qs = query.toString();
  const path = qs ? `/public/books?${qs}` : "/public/books";

  try {
    return await apiFetch<ListResult<Book>>(path);
  } catch (error) {
    console.error("Failed to fetch books:", error);
    // failed 标记供列表页区分「加载失败」与「暂无内容」
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0, failed: true };
  }
}

/** 书籍详情（含 Markdown 书评） */
export async function getBookById(id: string): Promise<BookDetail | null> {
  try {
    return await apiFetch<BookDetail>(`/public/books/${id}`);
  } catch (error) {
    console.error("Failed to fetch book detail:", error);
    return null;
  }
}
